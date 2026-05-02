import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NotFoundTrain from "../components/notFound/NotFoundTrain";

const REDIRECT_SECONDS = 5;

interface NotFoundPageProps {
    message?: string;
}

const NotFoundPage = (props: NotFoundPageProps) => {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(REDIRECT_SECONDS);

    const { message } = props;

    useEffect(() => {
      if (countdown <= 0) {
        navigate('/', { replace: true });
        return;
      }

      const timeoutId = window.setTimeout(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      return () => window.clearTimeout(timeoutId);
    }, [countdown, navigate]);
    
    const getMessageComp = () => {
      if (!message) return null;
      return (
        <div className="mt-8 px-6 py-4 rounded-2xl bg-gradient-to-br from-primary/10 to-blue-100/60 shadow-xl border border-primary/20 animate-fade-in">
          <div className="text-2xl font-extrabold text-primary mb-2 flex items-center gap-2 justify-center">
            <svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' fill='none' viewBox='0 0 24 24'><path fill='currentColor' d='M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm.75 15.25h-1.5v-1.5h1.5v1.5Zm0-3h-1.5v-7h1.5v7Z'/></svg>
            404
          </div>
          <div className="text-base font-semibold text-slate-700 dark:text-slate-200 whitespace-pre-line break-words">
            {message}
          </div>
        </div>
      );
    };

    const getCountDown = () => {
        return (
            <div className="mt-6 px-6 py-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 shadow-lg border border-slate-200/80 dark:border-slate-700/80 backdrop-blur-sm">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    {countdown} saniye içinde anasayfaya yönlendirileceksiniz.
                </p>
                <button
                    type="button"
                    onClick={() => navigate('/', { replace: true })}
                    className="mt-3 inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white shadow-md transition-transform hover:scale-105"
                >
                    Şimdi anasayfaya dön
                </button>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
            <NotFoundTrain/>
            {getMessageComp()}
            {getCountDown()}
        </div>
    )
};

export default NotFoundPage;