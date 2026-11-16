# FILE NÀY LÀM GÌ: Build API và hai web từ một lớp dependency Linux dùng chung.
# DÙNG BỞI: Các target api, visitor, admin trong docker-compose.yml.
# TẠI SAO: Không mang node_modules Windows vào Linux, không cài Expo trong container.
FROM node:24-bookworm-slim AS dependencies
WORKDIR /app
# Manifest được COPY trước: sửa giao diện không bắt cài lại mọi thư viện.
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/package.json
COPY packages/admin-core/package.json packages/admin-core/package.json
COPY packages/visitor-core/package.json packages/visitor-core/package.json
COPY packages/place-core/package.json packages/place-core/package.json
COPY packages/shared-types/package.json packages/shared-types/package.json
# Bỏ script build driver Windows vì container kết nối bằng SQL Authentication.
RUN npm ci --ignore-scripts --legacy-peer-deps --include-workspace-root --workspace=web --workspace=@travelguide/admin-core --workspace=@travelguide/visitor-core --workspace=@travelguide/place-core --workspace=@travelguide/shared-types

FROM dependencies AS source
# .dockerignore loại secret, .env thật, backup và cache máy cá nhân.
COPY --chown=node:node . .
RUN mkdir -p /app/.runtime && chown node:node /app/.runtime

FROM source AS api
# Tạo MP3 bằng đúng script Python hiện có, không thay nội dung thuyết minh.
RUN apt-get update && apt-get install -y --no-install-recommends python3 python3-venv ca-certificates && rm -rf /var/lib/apt/lists/*
RUN python3 -m venv /opt/tts && /opt/tts/bin/pip install --no-cache-dir -r scripts/ThuVienTaoGiongDoc.txt
# API chạy không có quyền root và không dùng sa.
USER node
ENV NODE_ENV=production
CMD ["node", "docker/scripts/KhoiChayApi.cjs", "catalog"]

FROM source AS web-build
USER node
# Hai entry riêng bảo toàn việc tách giao diện khách và quản lý.
RUN npm exec --workspace=web -- vite build && npm exec --workspace=web -- vite build --mode admin

FROM nginx:stable-alpine AS visitor
# Image cuối chỉ chứa Nginx và web tĩnh; không có Node, Python hoặc mật khẩu SQL.
COPY docker/nginx/DuKhach.conf /etc/nginx/conf.d/default.conf
COPY --from=web-build /app/apps/web/dist /usr/share/nginx/html

FROM nginx:stable-alpine AS admin
COPY docker/nginx/QuanTri.conf /etc/nginx/conf.d/default.conf
COPY --from=web-build /app/apps/web/dist-admin /usr/share/nginx/html
