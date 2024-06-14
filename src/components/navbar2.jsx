import React,{useState} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";

function Navbar2({ email }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // const closeMenu = () => {
  //   setIsMenuOpen(false);
  // };

  function handleLogout(){
    localStorage.clear()
    window.location.href = '/'
  }
  return (
    <div
      className="font-poppin flex justify-between items-center   bg-black p-3 mx-auto w-[98%] lg:w-[80%] xl:w-4/6 rounded-full"
      style={{ backgroundColor: "#303030F7" }}
    >

      
      <div className="flex gap-2">
        <div>
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="18.1766" cy="18" r="17.4706" fill="#107F41" />
          </svg>
        </div>
        <div className="text-white my-auto">Securewatch</div>
      </div>

<div className=" hidden md:flex gap-6">

    <button>
      <Link to="/dashboard">
      <div className="flex gap-2 mt-2 md:mt-0 cursor-pointer">
        <div className="my-auto">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_165_40)">
              <path
                d="M2.65039 7.525L10.0754 1.75L17.5004 7.525V16.6C17.5004 17.0376 17.3266 17.4573 17.0171 17.7667C16.7077 18.0762 16.288 18.25 15.8504 18.25H4.30039C3.86278 18.25 3.4431 18.0762 3.13366 17.7667C2.82423 17.4573 2.65039 17.0376 2.65039 16.6V7.525Z"
                stroke="#FFF2F2"
                stroke-width="1.65"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M7.60156 18.25V10H12.5516V18.25"
                stroke="#FFF2F2"
                stroke-width="1.65"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_165_40">
                <rect
                  width="19.8"
                  height="19.8"
                  fill="white"
                  transform="translate(0.175781 0.100006)"
                />
              </clipPath>
            </defs>
          </svg>
        </div>
        <div className="text-white my-auto">Overview</div>
      </div>
      </Link>
    </button>
      
    <button>
      <Link to="/monitor">
      <div className="flex gap-2 mt-2 md:mt-0 cursor-pointer">
        <div className="my-auto">
          <svg
            width="21"
            height="20"
            viewBox="0 0 21 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_165_37)">
              <path
                d="M1.40039 9.99999C1.40039 9.99999 4.70039 3.39999 10.4754 3.39999C16.2504 3.39999 19.5504 9.99999 19.5504 9.99999C19.5504 9.99999 16.2504 16.6 10.4754 16.6C4.70039 16.6 1.40039 9.99999 1.40039 9.99999Z"
                stroke="#FFF2F2"
                stroke-width="1.65"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10.475 12.475C11.8419 12.475 12.95 11.3669 12.95 9.99999C12.95 8.63309 11.8419 7.52499 10.475 7.52499C9.1081 7.52499 8 8.63309 8 9.99999C8 11.3669 9.1081 12.475 10.475 12.475Z"
                stroke="#FFF2F2"
                stroke-width="1.65"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_165_37">
                <rect
                  width="19.8"
                  height="19.8"
                  fill="white"
                  transform="translate(0.576172 0.100006)"
                />
              </clipPath>
            </defs>
          </svg>
        </div>
        <div className="text-white my-auto">Monitor</div>
      </div>
      </Link>
    </button>

    <button>
      <Link to="/log">
      <div className="flex gap-2 mt-2 md:mt-0 cursor-pointer">
        <div className="my-auto">
          <svg
            width="21"
            height="20"
            viewBox="0 0 21 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_165_43)">
              <path
                d="M4.27539 16.1875C4.27539 15.6405 4.49269 15.1159 4.87948 14.7291C5.26628 14.3423 5.79088 14.125 6.33789 14.125H17.4754"
                stroke="#FFF2F2"
                stroke-width="1.65"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.33789 1.75H17.4754V18.25H6.33789C5.79088 18.25 5.26628 18.0327 4.87948 17.6459C4.49269 17.2591 4.27539 16.7345 4.27539 16.1875V3.8125C4.27539 3.26549 4.49269 2.74089 4.87948 2.35409C5.26628 1.9673 5.79088 1.75 6.33789 1.75Z"
                stroke="#FFF2F2"
                stroke-width="1.65"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_165_43">
                <rect
                  width="19.8"
                  height="19.8"
                  fill="white"
                  transform="translate(0.976562 0.100006)"
                />
              </clipPath>
            </defs>
          </svg>
        </div>
        <div className="text-white my-auto">Logs</div>
      </div>
      </Link>
    </button>

      </div>

<div className="flex gap-3 items-center justify-center my-auto">
      <div className="tooltip-container bg-white rounded-full px-3 py-2 font-semibold mt-2 md:mt-0 flex items-center gap-3">
       <span className="hidden sm:block">{email}</span> 
        <FontAwesomeIcon icon={faSignOutAlt} className=" text-black cursor-pointer" onClick={handleLogout}  />
        <span className="tooltip-text">Logout</span>
      </div>


      <button  onClick={toggleMenu} className="md:hidden inline-flex items-center justify-center p-2 rounded-md  hover:text-white  focus:outline-none  focus:text-white">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            </div>

            {isMenuOpen && (
        <div className="absolute right-6 mt-48 bg-[#303030F7] border border-gray-300 rounded-md shadow-lg py-2 px-3 flex flex-col justify-start items-start gap-3" >
          
          <button>
      <Link to="/dashboard">
      <div className="flex gap-2 mt-2 md:mt-0 cursor-pointer">
        <div className="my-auto">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_165_40)">
              <path
                d="M2.65039 7.525L10.0754 1.75L17.5004 7.525V16.6C17.5004 17.0376 17.3266 17.4573 17.0171 17.7667C16.7077 18.0762 16.288 18.25 15.8504 18.25H4.30039C3.86278 18.25 3.4431 18.0762 3.13366 17.7667C2.82423 17.4573 2.65039 17.0376 2.65039 16.6V7.525Z"
                stroke="#FFF2F2"
                stroke-width="1.65"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M7.60156 18.25V10H12.5516V18.25"
                stroke="#FFF2F2"
                stroke-width="1.65"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_165_40">
                <rect
                  width="19.8"
                  height="19.8"
                  fill="white"
                  transform="translate(0.175781 0.100006)"
                />
              </clipPath>
            </defs>
          </svg>
        </div>
        <div className="text-white my-auto">Overview</div>
      </div>
      </Link>
    </button>
      
    <button>
      <Link to="/monitor">
      <div className="flex gap-2 mt-2 md:mt-0 cursor-pointer">
        <div className="my-auto">
          <svg
            width="21"
            height="20"
            viewBox="0 0 21 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_165_37)">
              <path
                d="M1.40039 9.99999C1.40039 9.99999 4.70039 3.39999 10.4754 3.39999C16.2504 3.39999 19.5504 9.99999 19.5504 9.99999C19.5504 9.99999 16.2504 16.6 10.4754 16.6C4.70039 16.6 1.40039 9.99999 1.40039 9.99999Z"
                stroke="#FFF2F2"
                stroke-width="1.65"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10.475 12.475C11.8419 12.475 12.95 11.3669 12.95 9.99999C12.95 8.63309 11.8419 7.52499 10.475 7.52499C9.1081 7.52499 8 8.63309 8 9.99999C8 11.3669 9.1081 12.475 10.475 12.475Z"
                stroke="#FFF2F2"
                stroke-width="1.65"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_165_37">
                <rect
                  width="19.8"
                  height="19.8"
                  fill="white"
                  transform="translate(0.576172 0.100006)"
                />
              </clipPath>
            </defs>
          </svg>
        </div>
        <div className="text-white my-auto">Monitor</div>
      </div>
      </Link>
    </button>

    <button>
      <Link to="/log">
      <div className="flex gap-2 mt-2 md:mt-0 cursor-pointer">
        <div className="my-auto">
          <svg
            width="21"
            height="20"
            viewBox="0 0 21 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_165_43)">
              <path
                d="M4.27539 16.1875C4.27539 15.6405 4.49269 15.1159 4.87948 14.7291C5.26628 14.3423 5.79088 14.125 6.33789 14.125H17.4754"
                stroke="#FFF2F2"
                stroke-width="1.65"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.33789 1.75H17.4754V18.25H6.33789C5.79088 18.25 5.26628 18.0327 4.87948 17.6459C4.49269 17.2591 4.27539 16.7345 4.27539 16.1875V3.8125C4.27539 3.26549 4.49269 2.74089 4.87948 2.35409C5.26628 1.9673 5.79088 1.75 6.33789 1.75Z"
                stroke="#FFF2F2"
                stroke-width="1.65"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_165_43">
                <rect
                  width="19.8"
                  height="19.8"
                  fill="white"
                  transform="translate(0.976562 0.100006)"
                />
              </clipPath>
            </defs>
          </svg>
        </div>
        <div className="text-white my-auto">Logs</div>
      </div>
      </Link>
    </button>

        </div>
      )}

    </div>
  );
}

export default Navbar2;
