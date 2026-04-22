import NotFoundTrain from "../components/notFound/NotFoundTrain";

interface NotFoundPageProps {
    message?: string;
}

const NotFoundPage = (props: NotFoundPageProps) => {

    const { message } = props;
    
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
    
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
            <NotFoundTrain/>
            {getMessageComp()}
        </div>
    )
};

export default NotFoundPage;