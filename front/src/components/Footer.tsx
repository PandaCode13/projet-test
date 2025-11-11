import { Link } from "react-router";

const Footer = () => {
  return (
    <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
      <p className="text-sm">
        © {new Date().getFullYear()} GlycAmed. All rights reserved.
      </p>
      <div className="flex space-x-6">
        <Link to="#" className="hover:text-blue-400 transition-colors">
          Privacy Policy
        </Link>
        <Link to="#" className="hover:text-blue-400 transition-colors">
          Terms
        </Link>
        <Link to="#" className="hover:text-blue-400 transition-colors">
          Contact
        </Link>
      </div>
    </div>
  );
};

export default Footer;
