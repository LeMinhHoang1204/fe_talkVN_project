import { enqueueSnackbar } from "notistack";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
// import ImageWithFallback from "../../components/ImageWithFallback";
import { useLoginMutation } from "../../data/auth/auth.api";
import { loginThunk } from "../../data/auth/auth.thunk";
import { apiBaseUrl } from "../../helpers/constants/configs.constant";
import { APP_ROUTE } from "../../helpers/constants/route.constant";
import { useAppDispatch } from "../../hooks/reduxHooks";

type LoginInput = {
  userName: string;
  password: string;
};

function LoginPage() {
  const formMethods = useForm<LoginInput>({
    defaultValues: {
      userName: "",
      password: "",
    },
  });

  const { control, handleSubmit } = formMethods;

  const [login, { isLoading: isLoginLoading }] = useLoginMutation();

  const dispatch = useAppDispatch();

  const onLogin = async (data: LoginInput) => {
    await login({
      userName: data.userName,
      password: data.password,
    })
      .unwrap()
      .then((res) => {
        dispatch(loginThunk(res.result));
        enqueueSnackbar("Login successfully", { variant: "success" });
      })
      .catch((err) => {
        console.log("err", err);
        enqueueSnackbar("Login failed", { variant: "error" });
      });
  };

  const onLoginByGoogle = () => {
    window.location.href = `${apiBaseUrl}/User/login-google`;
  };

  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/video/backgroud_home.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="absolute inset-0 bg-[#3F2B6A] bg-opacity-70 z-0"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div
          className="bg-white bg-opacity-80 rounded-[40px] p-10 shadow-2xl max-w-md w-full"
          style={{ width: "450px" }}
        >
          <h1
            className="text-5xl font-bold text-center text-[#3F2B6A] mb-8 cursor-pointer"
            onClick={() => navigate("/")}
          >
            TalkVN
          </h1>
          <FormProvider {...formMethods}>
            <form onSubmit={handleSubmit(onLogin)} className="space-y-6">
              <Controller
                control={control}
                name="userName"
                render={({ field }) => (
                  <input
                    {...field}
                    autoComplete="off"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-700"
                    placeholder="Enter your username"
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field }) => (
                  <input
                    {...field}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-700"
                    placeholder="Enter your password"
                    type="password"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSubmit(onLogin)();
                      }
                    }}
                  />
                )}
              />

              <button
                type="submit"
                disabled={isLoginLoading}
                onClick={handleSubmit(onLogin)}
                className="w-full bg-purple-800 text-white py-3 rounded-xl hover:bg-purple-900 transition"
              >
                Login
              </button>
              {/* <p className="text-center text-sm text-gray-700"> Or </p> */}
              <button
                type="button"
                onClick={onLoginByGoogle}
                className="w-full flex items-center justify-center gap-3 border border-gray-400 text-gray-700 py-3 rounded-xl hover:bg-gray-100 transition"
              >
                {/* <img src="/icon_google.jpg" alt="Google" className="w-5 h-5" /> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 488 512"
                  className="w-5 h-5"
                >
                  <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
                </svg>
                Sign in with Google
              </button>

              <p className="text-center text-sm text-gray-700 mt-6">
                Don't have an account?{" "}
                <button
                  onClick={() => {
                    navigate(APP_ROUTE.AUTH.SIGNUP);
                  }}
                  className="text-[#4BB4F8] text-xs font-medium "
                >
                  Sign up
                </button>
              </p>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}
export default LoginPage;
