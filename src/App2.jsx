import {useDispatch, useSelector} from "react-redux";
import PAGE_STATE from "./enum/PageStateEnum.jsx";
import {useCookies} from "react-cookie";
import {useEffect} from "react";
import {Login} from "./store/UserSlice.tsx"
import COOKIE from "./enum/CookieNameEnum.jsx";
import Menu from "./interface/Menu.jsx"
import InGameInterface2 from "./interface/InGameInterface2.jsx";
import Loading from "./interface/Loading.jsx";
import Mainmanu from './interface/Mainmanu.tsx';


function App2() {

    const pageState = useSelector(state => state.pageStateStore.pageState)
    const [cookies, setCookie, removeCookie] = useCookies([COOKIE.name]);
    const dispatch = useDispatch()

    useEffect(() => {
        if (cookies[COOKIE.name]){
            dispatch(Login({
                userId: cookies[COOKIE.name].userId,
                username: cookies[COOKIE.name].username,
                token: cookies[COOKIE.name].token,
                imagePath: cookies[COOKIE.name].imagePath
            }))
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
            {RenderPage()}
            {/* <Mainmanu></Mainmanu> */}
            {/* <InGameInterface2 /> */}
        </div>
    )
}
export default App2