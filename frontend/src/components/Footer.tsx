import React from "react"

const Footer: React.FC = () => {
  return (
    <footer className="bg-orange-500 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="mb-4">
            <h2 className="text-lg font-bold mb-2">About Us</h2>
            <p className="text-sm">Whether you're reconnecting with old friends, staying in touch with family members across the globe, or fostering new relationships with like-minded individuals.</p>
          </div>

          <div className="mb-4">
            <h2 className="text-lg font-bold mb-2">Quick Links</h2>
            <ul className="list-none text-sm">
              <li><a href="/#features">Features</a></li>
              <li><a href="/#faq">FAQs</a></li>
              <li><a href="/#contact">Contact Us</a></li>
            </ul>
          </div>

          <div className="mb-4" id="contact">
            <h2 className="text-lg font-bold mb-2">Follow Us</h2>
            <div className="flex space-x-4">
              <a href="https://github.com/gyanendra-baghel" className="text-white hover:text-gray-400 transition duration-300" target="_blank">Github</a>
              <a href="https://twitter.com/Gyan_Singh01" className="text-white hover:text-gray-400 transition duration-300" target="_blank">Twitter</a>
              <a href="https://www.linkedin.com/in/gyanendra-baghel" className="text-white hover:text-gray-400 transition duration-300" target="_blank">LinkedIn</a>

            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-4 text-sm text-center">
          <p>&copy; 2024 Social. All rights reserved.</p>
          <p>Designed by <a href="https://gyanendra-baghel.vercel.app/" className="text-white hover:text-gray-400 transition duration-300 font-bold" target="_blank">Gyanendra Baghel</a></p>
        </div>
      </div>
    </footer>
  )
}

export default Footer