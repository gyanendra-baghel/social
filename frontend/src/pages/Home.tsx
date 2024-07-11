import Header from "../components/Header";
import Hero from "../assets/hero.png"
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import { useEffect } from "react";

function Home() {

    useEffect(() => {
        toast.info('Don\'t forgot to fill feedback', {
            position: "bottom-right",
            autoClose: 5000,
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
            <main className="bg-neutral-800 flex flex-col justify-center items-center pb-10">
                <div className="h-screen flex flex-col justify-center items-center">
                    <div className="container justify-center lg:p-20 bg-neutral-900 rounded-bl-full px-10 my-12">
                        <div className="flex items-center mx-auto px-4 py-8 gap-14">
                            <div className="">
                                <h2 className="text-6xl font-extrabold mb-4 text-orange-500">Build <span className="text-orange-600">Network.</span></h2>
                                <p className="text-white text-xl font-semibold mb-6">
                                    With Social, you can build your own network and start chatting with your loved ones instantly.<span className="font-sans font-normal">Our platform empowers you to share moments, exchange ideas, and stay updated with the people who matter most to you.</span> </p>
                                <Link to="/explore" className="bg-orange-500 text-white py-2 px-8 rounded-full font-bold hover:border-orange-600 border-2 border-transparent hover:bg-transparent hover:text-orange-500">
                                    Join Now
                                </Link>
                            </div>
                            <div className="hidden md:flex max-w-xl justify-center items-center">
                                <img src={Hero} className="w-full" />
                            </div>
                        </div>
                    </div>
                </div>
                <hr />
                <section id="faq" className="bg-neutral-900 py-12">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-6 bg-neutral-800 rounded-lg shadow-md">
                                <h3 className="text-xl text-orange-500 font-semibold mb-2">How do I sign up for Social?</h3>
                                <p className="text-white">Signing up for Social is easy! Just click on the "Join Now" button on the homepage, then "Create Account" and fill in your details, and you'll be ready to start chatting in no time.</p>
                            </div>

                            <div className="p-6 bg-neutral-800 rounded-lg shadow-md">
                                <h3 className="text-xl text-orange-500 font-semibold mb-2">Is my data secure on Social?</h3>
                                <p className="">Yes, your data is very secure. We use encryption and security protocols to ensure your conversations and personal information remain private and protected.</p>
                            </div>

                            <div className="p-6 bg-neutral-800 rounded-lg shadow-md">
                                <h3 className="text-xl text-orange-500 font-semibold mb-2">Can I use Social on multiple devices?</h3>
                                <p className="">Absolutely! Social is designed to work seamlessly across multiple devices. You can access your account and continue your conversations from your phone, tablet, or computer.</p>
                            </div>

                            <div className="p-6 bg-neutral-800 rounded-lg shadow-md">
                                <h3 className="text-xl text-orange-500 font-semibold mb-2">How do I reset my password?</h3>
                                <p className="">If you've forgotten your password, just click on the "Forgot Password" link on the login page. Follow the instructions to reset your password and regain access to your account.</p>
                            </div>


                            {/* <div className="p-6 bg-neutral-800 rounded-lg shadow-md">
                                <h3 className="text-xl font-semibold mb-2">Are there any costs associated with using Social?</h3>
                                <p className="text-gray-700">Social offers a free plan with essential features. For advanced features and additional benefits, you can upgrade to one of our premium plans. Check out the Pricing section for more details.</p>
                            </div> */}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}

export default Home