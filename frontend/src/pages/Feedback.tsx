import { useEffect } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { toast } from 'react-toastify';

const Feedback: React.FC = () => {

    useEffect(() => {
        toast.info('Advance Thanks for feedback', {
            position: "bottom-right",
            autoClose: 9000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    }, []);

    return (
        <>
            <Header />
            <main className='min-h-screen bg-neutral-800 flex justify-center items-center'>
                <div className='invert'>
                    <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSeGOpwRuQtFqQKybMsqURx4lXrX1CZo_JnODCIm_e8bB2QfUQ/viewform?embedded=true" className=' mt-20 filter hue-rotate-189 saturate-18 brightness-96 w-[366px] h-[2000px] sm:w-[640px] sm:h-[1700px]'>Loading…</iframe>
                </div>
            </main >
            <Footer />
        </>
    )
}

export default Feedback