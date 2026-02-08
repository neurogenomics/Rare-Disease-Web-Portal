.PHONY: dev dev-frontend dev-backend

dev: dev-backend dev-frontend

dev-backend:
	cd backend && uvicorn main:app --reload --port 8001 &

dev-frontend:
	cd frontend && npm run dev -- --port 5175
