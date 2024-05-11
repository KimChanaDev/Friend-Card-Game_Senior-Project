import {useDispatch, useSelector} from "react-redux";
import PAGE_STATE from "./enum/PageStateEnum.jsx";
import {useCookies} from "react-cookie";
import {useEffect, useState} from "react";
import {Login} from "./store/UserSlice.tsx"
import COOKIE from "./enum/CookieNameEnum.jsx";
import InGameInterface2 from "./interface/InGameInterface2.jsx";
import Loading from "./interface/Loading.jsx";
import Mainmanu from './interface/Mainmanu.tsx';
import { Volume2, VolumeX } from 'react-feather';
import BGM from "./components/BGM.jsx";
import { GetProfile } from "./service/Api/ApiService.jsx";

function App2() {

    const pageState = useSelector(state => state.pageStateStore.pageState)
    const [cookies, setCookie, removeCookie] = useCookies([COOKIE.name]);
    const dispatch = useDispatch()

    useEffect(() => {
        if (cookies[COOKIE.name]) {
          (async () => {
            try {
              let userprofile = await GetProfile(cookies[COOKIE.name]);
              dispatch(
                Login({
                  userId: userprofile.response.data.UID,
                  username: userprofile.response.data.displayName,
                  token: cookies[COOKIE.name],
                  imagePath: userprofile.response.data.imagePath,
                })
              );
            } catch (error) {
              console.error('Error :', error.message);
            }
          })();
        }
      }, [cookies, dispatch]);

    function RenderPage(){
        switch (pageState) {
            case PAGE_STATE.MENU:
                // return ( <Menu setCookie={setCookie} removeCookie={removeCookie}/> )
                return (<Mainmanu setCookie={setCookie} removeCookie={removeCookie}/>)
            case PAGE_STATE.IN_GAME_INTERFACE:
                return ( <InGameInterface2 /> )
            case PAGE_STATE.LOADING:
                return ( <Loading /> )
            default:
                return null
        }
    }
    return (
        <div className="app">
            <BGM />
            {RenderPage()}
        </div>
    )
}
export default App2
