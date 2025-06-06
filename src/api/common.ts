import { http } from "@/utils/http";
import { baseUrlApi } from "@/utils/http/baseUrlApi";

// 图片上传函数 file/upload 请求数据类型是 multipart/form-data
// export const formUpload = file => {
//   console.log(file);
//   const formData = new FormData();
//   formData.append("file", file);

//   return http.post(
//     // baseUrlApi("file/upload"),
//     "https://run.mocky.io/v3/3aa761d7-b0b3-4a03-96b3-6168d4f7467b",
//     { formData },
//     {
//       headers: {
//         "Content-Type": "multipart/form-data"
//       }
//     }
//   );
// };


/** 文件上传 */
export const formUpload = data => {
  return http.request<Result>(
    "post",
    // "https://run.mocky.io/v3/3aa761d7-b0b3-4a03-96b3-6168d4f7467b",
    baseUrlApi("file/upload"),
    { data },
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );
};