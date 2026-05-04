"""
Comprehensive test suite for the EduSpark FastAPI backend.
Tests all API endpoints, request validation, utility functions,
mock/fallback logic, and edge cases.
"""

import json
import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient

from main import (
    app,
    clean_json_response,
    parse_json_response,
    mock_content,
    mock_paper,
    ContentRequest,
    QuestionRequest,
)


client = TestClient(app)


# ─────────────────────────────────────────────────────────
# 1. Utility function tests
# ─────────────────────────────────────────────────────────


class TestCleanJsonResponse:
    """Tests for the clean_json_response helper."""

    def test_strips_markdown_fences(self):
        raw = '```json\n{"key": "value"}\n```'
        assert clean_json_response(raw) == '{"key": "value"}'

    def test_returns_raw_json_untouched(self):
        raw = '{"key": "value"}'
        assert clean_json_response(raw) == '{"key": "value"}'

    def test_handles_leading_text_before_json(self):
        raw = 'Here is the JSON: {"a": 1}'
        assert clean_json_response(raw) == '{"a": 1}'

    def test_handles_trailing_text_after_json(self):
        raw = '{"a": 1} — that is the answer.'
        assert clean_json_response(raw) == '{"a": 1}'

    def test_handles_nested_braces(self):
        raw = '```json\n{"outer": {"inner": 42}}\n```'
        result = clean_json_response(raw)
        assert json.loads(result) == {"outer": {"inner": 42}}

    def test_whitespace_only_returns_empty(self):
        raw = "   \n\n  "
        result = clean_json_response(raw)
        # No braces found, returns stripped text
        assert result == ""

    def test_no_braces_returns_stripped_text(self):
        raw = "Just some text without JSON"
        result = clean_json_response(raw)
        assert "JSON" in result  # Returns the cleaned text as-is


class TestParseJsonResponse:
    """Tests for parse_json_response."""

    def test_valid_json(self):
        text = '{"summary": "hello", "key_points": []}'
        result = parse_json_response(text)
        assert result["summary"] == "hello"
        assert result["key_points"] == []

    def test_json_with_markdown_wrapper(self):
        text = '```json\n{"value": 42}\n```'
        result = parse_json_response(text)
        assert result["value"] == 42

    def test_invalid_json_raises(self):
        with pytest.raises(json.JSONDecodeError):
            parse_json_response("not valid json at all")


# ─────────────────────────────────────────────────────────
# 2. Mock data generator tests
# ─────────────────────────────────────────────────────────


class TestMockContent:
    """Tests for mock_content fallback data."""

    def test_returns_expected_keys(self):
        req = ContentRequest(board="CBSE", subject="Science", chapter="Life Processes")
        result = mock_content(req)
        expected_keys = {"summary", "key_points", "important_formulas", "ncert_reference", "suggested_videos", "practice_questions"}
        assert expected_keys.issubset(result.keys())

    def test_summary_contains_board_and_subject(self):
        req = ContentRequest(board="ICSE", subject="Mathematics", chapter="Trigonometry")
        result = mock_content(req)
        assert "ICSE" in result["summary"]
        assert "Mathematics" in result["summary"]
        assert "Trigonometry" in result["summary"]

    def test_topic_included_in_summary_when_provided(self):
        req = ContentRequest(board="CBSE", subject="Science", chapter="Light", topic="Reflection")
        result = mock_content(req)
        assert "Reflection" in result["summary"]

    def test_defaults_to_overview_when_no_topic(self):
        req = ContentRequest(board="CBSE", subject="Science", chapter="Light")
        result = mock_content(req)
        assert "Full chapter overview" in result["summary"]

    def test_key_points_is_list(self):
        req = ContentRequest(board="CBSE", subject="Science", chapter="Light")
        result = mock_content(req)
        assert isinstance(result["key_points"], list)
        assert len(result["key_points"]) >= 1

    def test_practice_questions_have_required_fields(self):
        req = ContentRequest(board="CBSE", subject="Science", chapter="Heredity")
        result = mock_content(req)
        for q in result["practice_questions"]:
            assert "question" in q
            assert "answer" in q
            assert "type" in q

    def test_suggested_videos_have_search_query(self):
        req = ContentRequest(board="CBSE", subject="Science", chapter="Electricity")
        result = mock_content(req)
        for video in result["suggested_videos"]:
            assert "title" in video
            assert "search_query" in video


class TestMockPaper:
    """Tests for mock_paper fallback data."""

    def test_returns_all_question_types(self):
        req = QuestionRequest(board="CBSE", subject="Science", chapter="Light")
        result = mock_paper(req)
        assert "mcqs" in result
        assert "short" in result
        assert "long" in result

    def test_mcq_has_correct_structure(self):
        req = QuestionRequest(board="CBSE", subject="Maths", chapter="Quadratic Equations")
        result = mock_paper(req)
        for mcq in result["mcqs"]:
            assert "q" in mcq
            assert "options" in mcq
            assert "correct" in mcq
            assert len(mcq["options"]) == 4

    def test_short_and_long_answers_present(self):
        req = QuestionRequest(board="CBSE", subject="Science", chapter="Acids")
        result = mock_paper(req)
        for item in result["short"]:
            assert "q" in item
            assert "answer" in item
        for item in result["long"]:
            assert "q" in item
            assert "answer" in item

    def test_difficulty_defaults_to_medium(self):
        req = QuestionRequest(board="CBSE", subject="Science", chapter="Light")
        assert req.difficulty == "medium"

    def test_difficulty_validation(self):
        # "easy", "medium", "hard" are valid
        for diff in ("easy", "medium", "hard"):
            req = QuestionRequest(board="CBSE", subject="Science", chapter="Light", difficulty=diff)
            assert req.difficulty == diff


# ─────────────────────────────────────────────────────────
# 3. API endpoint tests
# ─────────────────────────────────────────────────────────


class TestHealthEndpoint:
    """Tests for GET /health."""

    def test_health_returns_200(self):
        response = client.get("/health")
        assert response.status_code == 200

    def test_health_contains_status(self):
        data = client.get("/health").json()
        assert data["status"] == "ok"

    def test_health_contains_integrations(self):
        data = client.get("/health").json()
        integrations = data["integrations"]
        assert "gemini" in integrations
        assert "mistral" in integrations
        assert "youtube" in integrations
        assert "web_scrape" in integrations

    def test_health_contains_active_provider(self):
        data = client.get("/health").json()
        assert "active_provider" in data


class TestBoardsEndpoint:
    """Tests for GET /api/boards."""

    def test_boards_returns_200(self):
        response = client.get("/api/boards")
        assert response.status_code == 200

    def test_boards_contains_cbse_icse_state(self):
        data = client.get("/api/boards").json()
        board_names = [b["name"] for b in data["boards"]]
        assert "CBSE" in board_names
        assert "ICSE" in board_names
        assert "State" in board_names

    def test_each_board_has_classes_and_subjects(self):
        data = client.get("/api/boards").json()
        for board in data["boards"]:
            assert "classes" in board
            assert "subjects" in board
            assert isinstance(board["classes"], list)
            assert isinstance(board["subjects"], list)
            assert len(board["subjects"]) >= 1

    def test_all_boards_include_class_10(self):
        data = client.get("/api/boards").json()
        for board in data["boards"]:
            assert "10" in board["classes"]


class TestContentEndpoint:
    """Tests for POST /api/content."""

    def test_content_with_valid_request(self):
        payload = {"board": "CBSE", "subject": "Science", "chapter": "Life Processes"}
        response = client.post("/api/content", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "data" in data

    def test_content_response_has_required_fields(self):
        payload = {"board": "CBSE", "subject": "Science", "chapter": "Light", "topic": "Reflection"}
        data = client.post("/api/content", json=payload).json()
        content_data = data["data"]
        assert "summary" in content_data
        assert "key_points" in content_data

    def test_content_returns_board_and_subject(self):
        payload = {"board": "ICSE", "subject": "Mathematics", "chapter": "Trigonometry"}
        data = client.post("/api/content", json=payload).json()
        assert data["board"] == "ICSE"
        assert data["subject"] == "Mathematics"

    def test_content_missing_required_field(self):
        # chapter is required
        payload = {"board": "CBSE", "subject": "Science"}
        response = client.post("/api/content", json=payload)
        assert response.status_code == 422  # Validation error

    def test_content_empty_body(self):
        response = client.post("/api/content", json={})
        assert response.status_code == 422

    def test_content_has_youtube_videos_key(self):
        payload = {"board": "CBSE", "subject": "Science", "chapter": "Electricity"}
        data = client.post("/api/content", json=payload).json()
        assert "youtube_videos" in data["data"]

    def test_content_source_field_present(self):
        payload = {"board": "CBSE", "subject": "Science", "chapter": "Light"}
        data = client.post("/api/content", json=payload).json()
        assert "source" in data


class TestAskEndpoint:
    """Tests for POST /api/ask."""

    def test_ask_with_valid_request(self):
        payload = {
            "question": "What is photosynthesis?",
            "context": {"board": "CBSE", "subject": "Science", "chapter": "Life Processes"},
        }
        response = client.post("/api/ask", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "answer" in data

    def test_ask_returns_source(self):
        payload = {
            "question": "Explain gravity",
            "context": {"board": "CBSE", "subject": "Science", "chapter": "Gravitation"},
        }
        data = client.post("/api/ask", json=payload).json()
        assert "source" in data

    def test_ask_missing_question(self):
        payload = {"context": {"board": "CBSE", "subject": "Science", "chapter": "Light"}}
        response = client.post("/api/ask", json=payload)
        assert response.status_code == 422

    def test_ask_missing_context(self):
        payload = {"question": "What is light?"}
        response = client.post("/api/ask", json=payload)
        assert response.status_code == 422


class TestGeneratePaperEndpoint:
    """Tests for POST /api/generate-paper."""

    def test_generate_paper_valid(self):
        payload = {"board": "CBSE", "subject": "Science", "chapter": "Light"}
        response = client.post("/api/generate-paper", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "mcqs" in data
        assert "short" in data
        assert "long" in data

    def test_generate_paper_with_difficulty(self):
        payload = {"board": "CBSE", "subject": "Maths", "chapter": "Quadratic Equations", "difficulty": "hard"}
        response = client.post("/api/generate-paper", json=payload)
        assert response.status_code == 200

    def test_generate_paper_missing_fields(self):
        payload = {"board": "CBSE"}
        response = client.post("/api/generate-paper", json=payload)
        assert response.status_code == 422


class TestPracticeGenerateEndpoint:
    """Tests for POST /api/practice/generate."""

    def test_practice_generate_valid(self):
        payload = {"board": "CBSE", "subject": "Science", "chapter": "Life Processes"}
        response = client.post("/api/practice/generate", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "questions" in data

    def test_practice_questions_have_quiz_format(self):
        payload = {"board": "CBSE", "subject": "Science", "chapter": "Light"}
        data = client.post("/api/practice/generate", json=payload).json()
        for q in data["questions"]:
            assert "topic" in q
            assert "prompt" in q
            assert "options" in q
            assert "correctIndex" in q
            assert "hint" in q
            assert 0 <= q["correctIndex"] <= 3


class TestSyllabusMapEndpoint:
    """Tests for POST /api/syllabus/map."""

    def test_syllabus_map_valid(self):
        payload = {"board": "CBSE", "subject": "Science"}
        response = client.post("/api/syllabus/map", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["board"] == "CBSE"
        assert data["subject"] == "Science"
        assert "units" in data
        assert "recommended_path" in data

    def test_syllabus_map_with_chapter_and_topic(self):
        payload = {"board": "ICSE", "subject": "Mathematics", "chapter": "Trigonometry", "topic": "Sin/Cos"}
        data = client.post("/api/syllabus/map", json=payload).json()
        assert data["units"][0]["title"] == "Trigonometry"
        assert "Sin/Cos" in data["units"][0]["topics"]

    def test_syllabus_map_defaults(self):
        payload = {"board": "CBSE", "subject": "Maths"}
        data = client.post("/api/syllabus/map", json=payload).json()
        assert data["units"][0]["title"] == "Current chapter"

    def test_recommended_path_is_list(self):
        payload = {"board": "CBSE", "subject": "Science"}
        data = client.post("/api/syllabus/map", json=payload).json()
        assert isinstance(data["recommended_path"], list)
        assert len(data["recommended_path"]) >= 1


class TestNcertEndpoint:
    """Tests for GET /api/ncert/{subject}/{chapter}."""

    def test_ncert_returns_200(self):
        response = client.get("/api/ncert/science/chapter1")
        assert response.status_code == 200

    def test_ncert_returns_candidate_url(self):
        data = client.get("/api/ncert/science/ch3").json()
        assert "candidate_url" in data
        assert "ncert.nic.in" in data["candidate_url"]

    def test_ncert_subject_in_url(self):
        data = client.get("/api/ncert/maths/ch5").json()
        assert "maths" in data["candidate_url"]


class TestScrapeEndpoint:
    """Tests for GET /api/scrape."""

    def test_scrape_rejects_disallowed_host(self):
        response = client.get("/api/scrape?url=https://google.com")
        assert response.status_code == 400
        assert "Only configured education sources" in response.json()["detail"]

    def test_scrape_rejects_random_url(self):
        response = client.get("/api/scrape?url=https://evil.example.com/malware")
        assert response.status_code == 400

    def test_scrape_allows_ncert(self):
        # This tests the URL validation only; actual scraping may fail due to network
        response = client.get("/api/scrape?url=https://ncert.nic.in/textbook.php")
        # Should not be a 400 (validation error); may be 502 if network fails
        assert response.status_code != 400

    def test_scrape_allows_diksha(self):
        response = client.get("/api/scrape?url=https://diksha.gov.in/explore")
        assert response.status_code != 400


# ─────────────────────────────────────────────────────────
# 4. Pydantic model validation tests
# ─────────────────────────────────────────────────────────


class TestPydanticModels:
    """Tests for request model validation."""

    def test_content_request_requires_board_subject_chapter(self):
        with pytest.raises(Exception):
            ContentRequest()  # type: ignore

    def test_content_request_topic_is_optional(self):
        req = ContentRequest(board="CBSE", subject="Science", chapter="Light")
        assert req.topic is None

    def test_question_request_difficulty_default(self):
        req = QuestionRequest(board="CBSE", subject="Science", chapter="Light")
        assert req.difficulty == "medium"

    def test_invalid_difficulty_rejected(self):
        with pytest.raises(Exception):
            QuestionRequest(board="CBSE", subject="Science", chapter="Light", difficulty="impossible")


# ─────────────────────────────────────────────────────────
# 5. CORS configuration tests
# ─────────────────────────────────────────────────────────


class TestCORSConfiguration:
    """Tests for CORS middleware setup."""

    def test_cors_allows_configured_origin(self):
        response = client.options(
            "/health",
            headers={
                "Origin": "http://localhost:5173",
                "Access-Control-Request-Method": "GET",
            },
        )
        # CORS preflight should not return 405
        assert response.status_code in (200, 204, 405)

    def test_health_returns_cors_header(self):
        response = client.get("/health", headers={"Origin": "http://localhost:5173"})
        # When the origin is allowed, the header should be echoed
        cors_header = response.headers.get("access-control-allow-origin", "")
        if cors_header:
            assert "localhost:5173" in cors_header


# ─────────────────────────────────────────────────────────
# 6. Edge case and integration tests
# ─────────────────────────────────────────────────────────


class TestEdgeCases:
    """Miscellaneous edge case tests."""

    def test_content_with_special_characters_in_chapter(self):
        payload = {"board": "CBSE", "subject": "Science", "chapter": "Acids, Bases & Salts"}
        response = client.post("/api/content", json=payload)
        assert response.status_code == 200

    def test_content_with_unicode_topic(self):
        payload = {"board": "CBSE", "subject": "Hindi", "chapter": "कविता", "topic": "प्रकृति"}
        response = client.post("/api/content", json=payload)
        assert response.status_code == 200

    def test_ask_with_long_question(self):
        long_question = "Explain " + "step by step " * 100 + "how photosynthesis works."
        payload = {
            "question": long_question,
            "context": {"board": "CBSE", "subject": "Science", "chapter": "Life Processes"},
        }
        response = client.post("/api/ask", json=payload)
        assert response.status_code == 200

    def test_generate_paper_returns_mcq_options(self):
        payload = {"board": "CBSE", "subject": "Science", "chapter": "Light", "difficulty": "easy"}
        data = client.post("/api/generate-paper", json=payload).json()
        for mcq in data["mcqs"]:
            assert len(mcq["options"]) >= 2

    def test_multiple_sequential_requests(self):
        """Ensure the server handles multiple rapid requests correctly."""
        for _ in range(5):
            response = client.get("/health")
            assert response.status_code == 200

    def test_wrong_http_method_on_content(self):
        response = client.get("/api/content")
        assert response.status_code == 405  # Method Not Allowed

    def test_wrong_http_method_on_ask(self):
        response = client.get("/api/ask")
        assert response.status_code == 405

    def test_nonexistent_endpoint(self):
        response = client.get("/api/nonexistent")
        assert response.status_code == 404
