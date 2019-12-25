import axious from "axios";
import { Message, Loading } from 'element-ui';
import router from "./router";

let loading;
function startLoading() {
    loading = Loading.service({
        lock: true,
        text: "拼命加载中...",
        background: "rgba(0, 0, 0, 0.8)"
    });
}

function endLoading() {
    loading.close();

}

//请求拦截
axious.interceptors.request.use(config => {
    let token = localStorage.getItem("token");
    if (token) {
        config.headers.token = token;
        // iView.Spin.show();
    }
    return config;
},error => {
    return Promise.reject(error);
})

//响应拦截
axious.interceptors.response.use(response => {
    let token = response.headers.token;
    if (token != undefined){
        localStorage.setItem("token",token);
    }
    return response;
},error => {
    //Message.error(error.response.data);
    //获取错误状态码
    const { status } = error.response;
    if(status == 401) {
        Message.error("token失效，请重新登录！");
        //清除token
        localStorage.removeItem("token");
        router.push("/admin");
    }
    return Promise.reject(error);
})

export default axious;