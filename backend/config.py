import os

# Development defaults are loopback-only. A staging service can declare its
# exact frontend origins without editing the production configuration.
_LOCAL_ORIGINS = [
    f"http://{host}:{port}"
    for host in ("localhost", "127.0.0.1")
    for port in (5173, 5174, 5175, 5180)
]
CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv("PORTAL_CORS_ORIGINS", ",".join(_LOCAL_ORIGINS)).split(",")
    if origin.strip()
]
HOST = os.getenv("PORTAL_HOST", "127.0.0.1")
PORT = int(os.getenv("PORTAL_PORT", "8001"))

# Run in server
# CORS_ORIGINS = [
#     "http://146-169-8-136.dsi.ic.ac.uk",
#     "https://neurogenomics-ukdri.dsi.ic.ac.uk",
#     "http://146.169.8.136",
# ]
# HOST = "0.0.0.0"
# PORT = 8900

# Common
MONGODB_URI = os.getenv("PORTAL_MONGODB_URI", "mongodb://localhost:27017/")
