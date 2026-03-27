sync.bat  脚本 同时推送到两个仓库
：需要先 add commit


## 推送到 cnb
git subtree push --prefix=backend cnb-backend main


## 推送到 github
git push -u origin main
