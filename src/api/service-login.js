import axios from '@/utils/http.js'
export function loginByPhone(source,phone,password){
 return axios.get(`/music-login/loginByPhone?source=${source}&phone=${phone}&password=${password}`)
}