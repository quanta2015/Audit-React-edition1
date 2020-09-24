SERVICE_UPLOAD='localhost:8080/uploadtest'
SERVICE_RELEASE='localhost:8080/release'
FILE_CODE='/Users/manqingchen/Documents/Project/Audit/site/build/code.zip'

zip -r ./build/code.zip ./build

# 上传代码
curl $SERVICE_UPLOAD -F "file=@$PROJ_PATH"

# 解压更新代码
curl $SERVICE_RELEASE 