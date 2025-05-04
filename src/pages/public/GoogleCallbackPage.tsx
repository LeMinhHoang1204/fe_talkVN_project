import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import { useExchangeAuthCodeMutation } from "../../data/auth/auth.api";
import { loginThunk } from "../../data/auth/auth.thunk";
import { useAppDispatch } from "../../hooks/reduxHooks";

function GoogleCallbackPage() {
  const dispatch = useAppDispatch(); 
  const [exchangeAuthCode] = useExchangeAuthCodeMutation(); 

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get("authCode");

    if (!authCode) {
      console.error("No auth code found");
      return;
    }

    const handleExchangeAuthCode = async (authCode: string) => {
      try {
        const res = await exchangeAuthCode({ authCode }).unwrap();
        dispatch(loginThunk(res.result)); 
        enqueueSnackbar("Login successfully", { variant: "success" });
      } catch (err) {
        console.error("Exchange auth code failed", err);
        enqueueSnackbar("Login failed", { variant: "error" });
      }
    };

    handleExchangeAuthCode(authCode);
  }, [exchangeAuthCode]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p>Logging you in via Google...</p>
    </div>
  );
}

export default GoogleCallbackPage;
