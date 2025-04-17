import React, { useEffect, useState } from "react";
import NewNavbar from "./NewNavbar";
import Sidebar from "./Sidebar";
import { Link } from "react-router-dom";
import { baseUrl } from "../Constants/data";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BillingForm = () => {
    const userId = localStorage.getItem("userId");
    const userEmail = localStorage.getItem("email");
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState(1);
    const token = localStorage.getItem("token");
    const [previousValues, setPreviousValues] = useState(
        {
            "legal_name": "Tech Solutions Ltd.",
            "first_name": "Johns",
            "last_name": "Doe",
            "billing_email": "john.doe@example.com",
            "gst_tax_number": "GST123456789",
            "billing_phone": "+1234567890",
            "address": "123 Tech Park, Silicon Valley",
            "city": "San Franciscos",
            "state": "Californias",
            "country": "Swaziland",
            "pin_code": "94105"
          }
          
    );
    const handleSubmit = async (e) => {
        // e.preventDefault();
        setLoading(true);
        const requestOptions = {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ ...previousValues, user_id: userId }),
        };
        const response = await fetch(`${baseUrl}/addOrgInfo`, requestOptions);
        console.log("response", response);
        const data = await response.json();
        setPreviousValues(data);
        setValue(value + 1);
        if (response.ok) {
            setLoading(false);
            toast.success(data.message);
        } else {
            setLoading(false);
            toast.error(data.message);
        }
    }

     useEffect(() => {
        setLoading(true);
        const fetchPreviousValues = async () => {
          setLoading(true);
          const res = await fetch(`${baseUrl}/viewOrgInfo`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
             Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              user_id: userId,
            }),
          });
          const data = await res.json();
          setPreviousValues(data.organisation_info);
          setLoading(false);
        };
        fetchPreviousValues();
      }, [userId, value]);

      useEffect(() => {
        console.log("previousValues", previousValues);
        
      }
        , [previousValues]);

    if (loading) {
        return (
            <div className="w-full min-h-full">
                 <NewNavbar email={userEmail} />
                  <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover
                           />
                 <div className="bg-[#FAFAFA] w-full flex h-full">
            <Sidebar />

            <div className=" h-full md:flex flex-col gap-5 ml-[100px] mt-20 hidden">
                <div className={`mt-5 py-3 pl-4 pr-20 rounded-r-full bg-[#0A65C9]`}>
                    <h1 className="text-white font-semibold text-nowrap">Admin Panel</h1>
                </div>
                <div className="flex flex-col gap-5 ml-5">
                    <Link to="/admin" className="text-[#6A6A6A]" >
                        Account access
                    </Link>
                    <Link to="/billing" className="text-[#2D5C8F] font-semibold">
                        Billing
                    </Link>

                </div>
            </div>

            <div className="text-center  text-4xl font-medium text-black min-h-screen  sm:ml-24 md:ml-0 pb-10 mt-20 w-full flex  justify-center">
        <span className="loading loading-spinner loading-lg text-[#2D5C8F]"></span>
      </div>

           
        </div>
            </div>
            
        );
      }


    return (
        <div className="w-full min-h-full">
            <NewNavbar email={userEmail} />
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover
                     />
            <div className="bg-[#FAFAFA] w-full flex h-full">
                <Sidebar />

                <div className=" h-full md:flex flex-col gap-5 ml-[100px] mt-20 hidden">
                    <div className={`mt-5 py-3 pl-4 pr-20 rounded-r-full bg-[#0A65C9]`}>
                        <h1 className="text-white font-semibold text-nowrap">Admin Panel</h1>
                    </div>
                    <div className="flex flex-col gap-5 ml-5">
                        <Link to="/admin" className="text-[#6A6A6A]" >
                            Account access
                        </Link>
                        
                        <Link to="/billing" className="text-[#2D5C8F] font-semibold">
                            Billing
                        </Link>
                        <Link to="/pricing" className="text-[#6A6A6A]" >
                        Plans
                        </Link>

                    </div>
                </div>

                <div className="min-h-screen  sm:ml-24 md:ml-0 pb-10     mt-20 w-full flex flex-col items-start  ">
                    <div className="p-4 md:p-6 ">
                        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center ">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
                                <h1 className="text-xl  text-[#6A6A6A] font-semibold">
                                    Billing Information
                                </h1>
                            </div>

                        </div>


                    </div>
                    <div className="w-full p-3 md:p-0  md:pl-6    ">

                        <p className=" text-black">
                            <strong className=" text-lg font-semibold text-black">Enter the organisation's address</strong>
                            <br />
                            Enter either the address on the document you submitted or where the
                            organisation is registered.
                        </p>

                        <form className="mt-4 space-y-4 w-full" onSubmit={handleSubmit}>
                            <div className="flex flex-col items-start justify-start gap-2 w-full md:w-[45%]">
                                <label className="text-sm font-medium text-[#6A6A6A]">LEGAL NAME</label>
                                <input 
                                    type="text"
                                    className="w-full p-2 border border-gray-300 bg-white rounded-md"
                                    value={previousValues.legal_name}
                                    onChange={(e) => setPreviousValues({ ...previousValues, legal_name: e.target.value })}
                                
                                />
                            </div>

                            <div className="flex flex-row gap-4 flex-wrap w-full ">
                                <div className="flex flex-col items-start justify-start gap-2 w-full md:w-[45%]">
                                    <label className="text-sm font-medium text-[#6A6A6A]">FIRST NAME</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 bg-white rounded-md" 
                                        value={previousValues.first_name}
                                        onChange={(e) => setPreviousValues({ ...previousValues, first_name: e.target.value })}
                                        />
                                </div>
                                <div className="flex flex-col items-start justify-start gap-2 w-full md:w-[45%]">
                                    <label className="text-sm font-medium text-[#6A6A6A]">LAST NAME</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-2 border border-gray-300 bg-white rounded-md"
                                        value={previousValues.last_name}
                                        onChange={(e) => setPreviousValues({ ...previousValues, last_name: e.target.value })}
                                        />
                                </div>
                            </div>

                            <div className="flex flex-row gap-4 flex-wrap w-full">

                                <div className="flex flex-col items-start justify-start gap-2 w-full md:w-[45%]">
                                    <label className="text-sm font-medium text-[#6A6A6A]">BILLING EMAIL ID</label>
                                    <input 
                                        type="email" 
                                        className="w-full p-2 border border-gray-300 bg-white rounded-md" placeholder="email id"
                                        value={previousValues.billing_email}
                                        onChange={(e) => setPreviousValues({ ...previousValues, billing_email: e.target.value })}
                                        />
                                </div>
                                <div className="flex flex-col items-start justify-start gap-2 w-full md:w-[45%]">
                                    <label className="text-sm font-medium text-[#6A6A6A]">GST / TAX NUMBER</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 bg-white rounded-md" placeholder="000 000 000"
                                        value={previousValues.gst_tax_number}
                                        onChange={(e) => setPreviousValues({ ...previousValues, gst_tax_number: e.target.value })}
                                        />
                                </div>
                            </div>

                            <div className="flex flex-row gap-4 flex-wrap w-full">
                                <div className="flex flex-col items-start justify-start gap-2 w-full md:w-[45%]">
                                    <label className="text-sm font-medium text-[#6A6A6A]">BILLING PHONE NUMBER</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 bg-white rounded-md"
                                        value={previousValues.billing_phone}
                                        onChange={(e) => setPreviousValues({ ...previousValues, billing_phone: e.target.value })}
                                         />
                                </div>
                                <div className="flex flex-col items-start justify-start gap-2 w-full md:w-[45%]">
                                    <label className="text-sm font-medium text-[#6A6A6A]">Address</label>
                                    <input 
                                        type="text"
                                        className="w-full p-2 border border-gray-300 bg-white rounded-md"
                                        value={previousValues.address}
                                        onChange={(e) => setPreviousValues({ ...previousValues, address: e.target.value })}
                                         />
                                </div>
                            </div>


                            <div className="flex flex-row gap-4 flex-wrap w-full">
                                <div className="flex flex-col items-start justify-start gap-2 w-full md:w-[45%]">
                                    <label className="text-sm font-medium text-[#6A6A6A]">CITY</label>
                                    <input 
                                        type="text"
                                        className="w-full p-2 border border-gray-300 bg-white rounded-md"
                                        value={previousValues.city}
                                        onChange={(e) => setPreviousValues({ ...previousValues, city: e.target.value })}
                                         />
                                </div>
                                <div className="flex flex-col items-start justify-start gap-2 w-full md:w-[45%]">
                                    <label className="text-sm font-medium text-[#6A6A6A]">STATE</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 bg-white rounded-md"
                                        value={previousValues.state}
                                        onChange={(e) => setPreviousValues({ ...previousValues, state: e.target.value })}
                                         />
                                </div>
                            </div>
                            <div className="flex flex-row gap-4 flex-wrap w-full">
                                <div className="flex flex-col items-start justify-start gap-2 w-full md:w-[45%]">
                                    <label className="text-sm font-medium text-[#6A6A6A]">Country</label>
                                    <select id="country" name="country" className="w-full p-2 py-3 border border-gray-300 bg-white rounded-md"
                                        value={previousValues.country}
                                        onChange={(e) => setPreviousValues({ ...previousValues, country: e.target.value })}
                                    >

                                        <option value="none" hidden >select country</option>
                                        <option value="Afghanistan">Afghanistan</option>
                                        <option value="\xC5land Islands">Åland Islands</option>
                                        <option value="Albania">Albania</option>
                                        <option value="Algeria">Algeria</option>
                                        <option value="American Samoa">American Samoa</option>
                                        <option value="Andorra">Andorra</option>
                                        <option value="Angola">Angola</option>
                                        <option value="Anguilla">Anguilla</option>
                                        <option value="Antarctica">Antarctica</option>
                                        <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                                        <option value="Argentina">Argentina</option>
                                        <option value="Armenia">Armenia</option>
                                        <option value="Aruba">Aruba</option>
                                        <option value="Australia">Australia</option>
                                        <option value="Austria">Austria</option>
                                        <option value="Azerbaijan">Azerbaijan</option>
                                        <option value="Bahamas">Bahamas</option>
                                        <option value="Bahrain">Bahrain</option>
                                        <option value="Bangladesh">Bangladesh</option>
                                        <option value="Barbados">Barbados</option>
                                        <option value="Belarus">Belarus</option>
                                        <option value="Belgium">Belgium</option>
                                        <option value="Belize">Belize</option>
                                        <option value="Benin">Benin</option>
                                        <option value="Bermuda">Bermuda</option>
                                        <option value="Bhutan">Bhutan</option>
                                        <option value="Bolivia">Bolivia</option>
                                        <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                                        <option value="Botswana">Botswana</option>
                                        <option value="Bouvet Island">Bouvet Island</option>
                                        <option value="Brazil">Brazil</option>
                                        <option value="British Indian Ocean Territory">British Indian Ocean Territory</option>
                                        <option value="Brunei Darussalam">Brunei Darussalam</option>
                                        <option value="Bulgaria">Bulgaria</option>
                                        <option value="Burkina Faso">Burkina Faso</option>
                                        <option value="Burundi">Burundi</option>
                                        <option value="Cambodia">Cambodia</option>
                                        <option value="Cameroon">Cameroon</option>
                                        <option value="Canada">Canada</option>
                                        <option value="Cape Verde">Cape Verde</option>
                                        <option value="Cayman Islands">Cayman Islands</option>
                                        <option value="Central African Republic">Central African Republic</option>
                                        <option value="Chad">Chad</option>
                                        <option value="Chile">Chile</option>
                                        <option value="China">China</option>
                                        <option value="Christmas Island">Christmas Island</option>
                                        <option value="Cocos (Keeling) Islands">Cocos (Keeling) Islands</option>
                                        <option value="Colombia">Colombia</option>
                                        <option value="Comoros">Comoros</option>
                                        <option value="Congo">Congo</option>
                                        <option value="Congo, The Democratic Republic">Congo, The Democratic Republic</option>
                                        <option value="Cook Islands">Cook Islands</option>
                                        <option value="Costa Rica">Costa Rica</option>
                                        <option value="Cote D'ivoire">Cote D'ivoire</option>
                                        <option value="Croatia">Croatia</option>
                                        <option value="Cuba">Cuba</option>
                                        <option value="Cyprus">Cyprus</option>
                                        <option value="Czech Republic">Czech Republic</option>
                                        <option value="Denmark">Denmark</option>
                                        <option value="Djibouti">Djibouti</option>
                                        <option value="Dominica">Dominica</option>
                                        <option value="Dominican Republic">Dominican Republic</option>
                                        <option value="Ecuador">Ecuador</option>
                                        <option value="Egypt">Egypt</option>
                                        <option value="El Salvador">El Salvador</option>
                                        <option value="Equatorial Guinea">Equatorial Guinea</option>
                                        <option value="Eritrea">Eritrea</option>
                                        <option value="Estonia">Estonia</option>
                                        <option value="Ethiopia">Ethiopia</option>
                                        <option value="Falkland Islands (Malvinas)">Falkland Islands (Malvinas)</option>
                                        <option value="Faroe Islands">Faroe Islands</option>
                                        <option value="Fiji">Fiji</option>
                                        <option value="Finland">Finland</option>
                                        <option value="France">France</option>
                                        <option value="French Guiana">French Guiana</option>
                                        <option value="French Polynesia">French Polynesia</option>
                                        <option value="French Southern Territories">French Southern Territories</option>
                                        <option value="Gabon">Gabon</option>
                                        <option value="Gambia">Gambia</option>
                                        <option value="Georgia">Georgia</option>
                                        <option value="Germany">Germany</option>
                                        <option value="Ghana">Ghana</option>
                                        <option value="Gibraltar">Gibraltar</option>
                                        <option value="Greece">Greece</option>
                                        <option value="Greenland">Greenland</option>
                                        <option value="Grenada">Grenada</option>
                                        <option value="Guadeloupe">Guadeloupe</option>
                                        <option value="Guam">Guam</option>
                                        <option value="Guatemala">Guatemala</option>
                                        <option value="Guernsey">Guernsey</option>
                                        <option value="Guinea">Guinea</option>
                                        <option value="Guinea-bissau">Guinea-bissau</option>
                                        <option value="Guyana">Guyana</option>
                                        <option value="Haiti">Haiti</option>
                                        <option value="Heard Island and Mcdonald Islands">Heard Island and Mcdonald Islands</option>
                                        <option value="Holy See (Vatican City State)">Holy See (Vatican City State)</option>
                                        <option value="Honduras">Honduras</option>
                                        <option value="Hong Kong">Hong Kong</option>
                                        <option value="Hungary">Hungary</option>
                                        <option value="Iceland">Iceland</option>
                                        <option value="India">India</option>
                                        <option value="Indonesia">Indonesia</option>
                                        <option value="Iran, Islamic Republic">Iran, Islamic Republic</option>
                                        <option value="Iraq">Iraq</option>
                                        <option value="Ireland">Ireland</option>
                                        <option value="Isle of Man">Isle of Man</option>
                                        <option value="Israel">Israel</option>
                                        <option value="Italy">Italy</option>
                                        <option value="Jamaica">Jamaica</option>
                                        <option value="Japan">Japan</option>
                                        <option value="Jersey">Jersey</option>
                                        <option value="Jordan">Jordan</option>
                                        <option value="Kazakhstan">Kazakhstan</option>
                                        <option value="Kenya">Kenya</option>
                                        <option value="Kiribati">Kiribati</option>
                                        <option value="Korea, Democratic People's Republic">Korea, Democratic People's Republic</option>
                                        <option value="Korea, Republic of">Korea, Republic of</option>
                                        <option value="Kuwait">Kuwait</option>
                                        <option value="Kyrgyzstan">Kyrgyzstan</option>
                                        <option value="Lao People's Democratic Republic">Lao People's Democratic Republic</option>
                                        <option value="Latvia">Latvia</option>
                                        <option value="Lebanon">Lebanon</option>
                                        <option value="Lesotho">Lesotho</option>
                                        <option value="Liberia">Liberia</option>
                                        <option value="Libyan Arab Jamahiriya">Libyan Arab Jamahiriya</option>
                                        <option value="Liechtenstein">Liechtenstein</option>
                                        <option value="Lithuania">Lithuania</option>
                                        <option value="Luxembourg">Luxembourg</option>
                                        <option value="Macao">Macao</option>
                                        <option value="Macedonia, The Former Yugoslav Republic">Macedonia, The Former Yugoslav Republic</option>
                                        <option value="Madagascar">Madagascar</option>
                                        <option value="Malawi">Malawi</option>
                                        <option value="Malaysia">Malaysia</option>
                                        <option value="Maldives">Maldives</option>
                                        <option value="Mali">Mali</option>
                                        <option value="Malta">Malta</option>
                                        <option value="Marshall Islands">Marshall Islands</option>
                                        <option value="Martinique">Martinique</option>
                                        <option value="Mauritania">Mauritania</option>
                                        <option value="Mauritius">Mauritius</option>
                                        <option value="Mayotte">Mayotte</option>
                                        <option value="Mexico">Mexico</option>
                                        <option value="Micronesia, Federated States">Micronesia, Federated States</option>
                                        <option value="Moldova, Republic">Moldova, Republic</option>
                                        <option value="Monaco">Monaco</option>
                                        <option value="Mongolia">Mongolia</option>
                                        <option value="Montenegro">Montenegro</option>
                                        <option value="Montserrat">Montserrat</option>
                                        <option value="Morocco">Morocco</option>
                                        <option value="Mozambique">Mozambique</option>
                                        <option value="Myanmar">Myanmar</option>
                                        <option value="Namibia">Namibia</option>
                                        <option value="Nauru">Nauru</option>
                                        <option value="Nepal">Nepal</option>
                                        <option value="Netherlands">Netherlands</option>
                                        <option value="Netherlands Antilles">Netherlands Antilles</option>
                                        <option value="New Caledonia">New Caledonia</option>
                                        <option value="New Zealand">New Zealand</option>
                                        <option value="Nicaragua">Nicaragua</option>
                                        <option value="Niger">Niger</option>
                                        <option value="Nigeria">Nigeria</option>
                                        <option value="Niue">Niue</option>
                                        <option value="Norfolk Island">Norfolk Island</option>
                                        <option value="Northern Mariana Islands">Northern Mariana Islands</option>
                                        <option value="Norway">Norway</option>
                                        <option value="Oman">Oman</option>
                                        <option value="Pakistan">Pakistan</option>
                                        <option value="Palau">Palau</option>
                                        <option value="Palestinian Territory, Occupied">Palestinian Territory, Occupied</option>
                                        <option value="Panama">Panama</option>
                                        <option value="Papua New Guinea">Papua New Guinea</option>
                                        <option value="Paraguay">Paraguay</option>
                                        <option value="Peru">Peru</option>
                                        <option value="Philippines">Philippines</option>
                                        <option value="Pitcairn">Pitcairn</option>
                                        <option value="Poland">Poland</option>
                                        <option value="Portugal">Portugal</option>
                                        <option value="Puerto Rico">Puerto Rico</option>
                                        <option value="Qatar">Qatar</option>
                                        <option value="Reunion">Reunion</option>
                                        <option value="Romania">Romania</option>
                                        <option value="Russian Federation">Russian Federation</option>
                                        <option value="Rwanda">Rwanda</option>
                                        <option value="Saint Helena">Saint Helena</option>
                                        <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                                        <option value="Saint Lucia">Saint Lucia</option>
                                        <option value="Saint Pierre and Miquelon">Saint Pierre and Miquelon</option>
                                        <option value="Saint Vincent and The Grenadines">Saint Vincent and The Grenadines</option>
                                        <option value="Samoa">Samoa</option>
                                        <option value="San Marino">San Marino</option>
                                        <option value="Sao Tome and Principe">Sao Tome and Principe</option>
                                        <option value="Saudi Arabia">Saudi Arabia</option>
                                        <option value="Senegal">Senegal</option>
                                        <option value="Serbia">Serbia</option>
                                        <option value="Seychelles">Seychelles</option>
                                        <option value="Sierra Leone">Sierra Leone</option>
                                        <option value="Singapore">Singapore</option>
                                        <option value="Slovakia">Slovakia</option>
                                        <option value="Slovenia">Slovenia</option>
                                        <option value="Solomon Islands">Solomon Islands</option>
                                        <option value="Somalia">Somalia</option>
                                        <option value="South Africa">South Africa</option>
                                        <option value="South Georgia and The South Sandwich Islands">South Georgia and The South Sandwich Islands</option>
                                        <option value="Spain">Spain</option>
                                        <option value="Sri Lanka">Sri Lanka</option>
                                        <option value="Sudan">Sudan</option>
                                        <option value="Suriname">Suriname</option>
                                        <option value="Svalbard and Jan Mayen">Svalbard and Jan Mayen</option>
                                        <option value="Swaziland">Swaziland</option>
                                        <option value="Sweden">Sweden</option>
                                        <option value="Switzerland">Switzerland</option>
                                        <option value="Syrian Arab Republic">Syrian Arab Republic</option>
                                        <option value="Taiwan">Taiwan</option>
                                        <option value="Tajikistan">Tajikistan</option>
                                        <option value="Tanzania, United Republic">Tanzania, United Republic</option>
                                        <option value="Thailand">Thailand</option>
                                        <option value="Timor-leste">Timor-leste</option>
                                        <option value="Togo">Togo</option>
                                        <option value="Tokelau">Tokelau</option>
                                        <option value="Tonga">Tonga</option>
                                        <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                                        <option value="Tunisia">Tunisia</option>
                                        <option value="Turkey">Turkey</option>
                                        <option value="Turkmenistan">Turkmenistan</option>
                                        <option value="Turks and Caicos Islands">Turks and Caicos Islands</option>
                                        <option value="Tuvalu">Tuvalu</option>
                                        <option value="Uganda">Uganda</option>
                                        <option value="Ukraine">Ukraine</option>
                                        <option value="United Arab Emirates">United Arab Emirates</option>
                                        <option value="United Kingdom">United Kingdom</option>
                                        <option value="United States">United States</option>
                                        <option value="United States Minor Outlying Islands">United States Minor Outlying Islands</option>
                                        <option value="Uruguay">Uruguay</option>
                                        <option value="Uzbekistan">Uzbekistan</option>
                                        <option value="Vanuatu">Vanuatu</option>
                                        <option value="Venezuela">Venezuela</option>
                                        <option value="Viet Nam">Viet Nam</option>
                                        <option value="Virgin Islands, British">Virgin Islands, British</option>
                                        <option value="Virgin Islands, U.S.">Virgin Islands, U.S.</option>
                                        <option value="Wallis and Futuna">Wallis and Futuna</option>
                                        <option value="Western Sahara">Western Sahara</option>
                                        <option value="Yemen">Yemen</option>
                                        <option value="Zambia">Zambia</option>
                                        <option value="Zimbabwe">Zimbabwe</option>
                                    </select>
                                </div>
                                <div className="flex flex-col items-start justify-start gap-2 w-full md:w-[45%]">
                                    <label className="text-sm font-medium text-[#6A6A6A]">Pin Code</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-2 border border-gray-300 bg-white rounded-md"
                                        value={previousValues.pin_code}
                                        onChange={(e) => setPreviousValues({ ...previousValues, pin_code: e.target.value })}
                                        />
                                </div>
                            </div>



                            <p className="text-xs text-gray-600">
                                By continuing, I agree with the <span className="text-green-600 cursor-pointer">Payment Policy</span> and
                                understand that my subscription will renew automatically at the end of term unless I cancel it.
                            </p>
                            <button className="px-5 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700" type="submit">Save</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );


};

export default BillingForm;
