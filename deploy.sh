#!/bin/bash

# 远端服务器信息
REMOTE_USER="root"
REMOTE_HOST="146.56.242.51"
REMOTE_PORT="22"
REMOTE_PATH="/opt/web/kechuang/dist"

# 本地 dist 文件夹路径
LOCAL_DIST="./dist"

# SSH 私钥文件路径（根据实际情况修改）
SSH_PRIVATE_KEY=~/.ssh/id_rsa

# 使用 ssh 和 scp 上传文件
echo "Starting deployment process..."

# 1. 删除本地 dist 目录下的文件
if [ -d "$LOCAL_DIST" ]; then
  echo "Deleting local dist folder..."
  rm -rf $LOCAL_DIST/*
  echo "Local dist folder cleaned."
else
  echo "Local dist folder does not exist, skipping deletion."
fi

# 2. 运行 npm run build 命令生成新的 dist 文件夹
echo "Running npm run build..."
npm run build
if [ $? -eq 0 ]; then
  echo "Build completed successfully."
else
  echo "Build failed, exiting..."
  exit 1
fi

# 3. 清空远端目标目录
echo "Deploying dist folder to remote server..."
ssh -i $SSH_PRIVATE_KEY -o StrictHostKeyChecking=no -p $REMOTE_PORT $REMOTE_USER@$REMOTE_HOST "rm -rf $REMOTE_PATH/*"
echo "Remote dist folder cleaned."

# 4. 上传本地 dist 文件夹内容到远端目标目录
scp -i $SSH_PRIVATE_KEY -rP $REMOTE_PORT $LOCAL_DIST/* $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH
if [ $? -eq 0 ]; then
  echo "Deployment completed successfully."
else
  echo "Deployment failed."
  exit 1
fi