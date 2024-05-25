import Modal from "react-modal";
import React, { useState } from "react";
import { Switch } from "@headlessui/react";


const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};
const Monitor_cmp = (props) => {
  const [enabled, setEnabled] = useState(false);
  const [disp, setDisp] = useState("block");
  const [disp1, setDisp1] = useState("block");
  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    if (disp == "none") setDisp("block");
    else setDisp("none");
  };
  const handleToggle1 = () => {
    if (disp1 == "none") setDisp1("block");
    else setDisp1("none");
  };

  function openModal() {
    setOpen(true);
  }
  function closeModal() {
    setOpen(false);
  }
  console.log(props.props.monitors);
  if (!props || !Array.isArray(props.props.monitors) || props.props.monitors.length === 0) {
    return (
      <div className="text-center mt-20 text-4xl font-medium">
        Please create a monitor.
      </div>
    );
  }

  return (
    <div>
      {props.props.monitors.map((i) => {
        const name = i.name;
        const risk = i.category;
        const network = i.network;
        return (
          <div className="mb-20">
            <div className="w-4/6 mx-auto mt-20 ">
              <div
                className="mt-10 p-6 flex justify-between flex-col md:flex-row rounded-2xl"
                style={{
                  border: "1px solid #0CA851",
                  boxShadow: "4px 4px 0px 0px #0CA851",
                }}
              >
                <div>
                  <div className="flex gap-3">
                    <div className="text-xl font-semibold">{name}</div>
                    <div className="text-[12px] mt-auto text-[#7D7D7D]">
                      {risk}
                    </div>
                  </div>
                  <div className="flex gap-4 mt-5 flex-wrap items-center ">
                    <div>
                      <div className="text-center font-medium">Networks</div>
                      <div className="bg-[#0CA851] px-3 py-2 rounded-md text-[13px] my-auto text-white">
                        {network}
                      </div>
                    </div>
                    <div>
                      <div className="text-center font-medium">Monitoring</div>
                      <div className="bg-[#E9E9E9] px-3 py-2 rounded-md  my-auto flex gap-2">
                        <div>
                          <svg
                            width="22"
                            height="22"
                            viewBox="0 0 22 22"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              x="0.759766"
                              y="0.909415"
                              width="20.4938"
                              height="20.4938"
                              rx="4.55417"
                              fill="#0CA851"
                            />
                          </svg>
                        </div>
                        <div className="my-auto text-[14px]">{name}</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-center font-medium">Conditions</div>
                      <div className=" px-3 py-2 rounded-md text-[14px] my-auto">
                        2 events and 3 functions
                      </div>
                    </div>
                    <div>
                      <div className="text-center font-medium">
                        Alerts Severity
                      </div>
                      <div className="bg-[#E9E9E9] px-3 py-2 rounded-md text-[14px] my-auto ">
                        Medium Severity
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row md:flex-col mt-4 gap-1 md:mt-0">
                  <div className="flex justify-end gap-3">
                    <Switch
                      checked={enabled}
                      onChange={setEnabled}
                      className={`${
                        enabled ? "bg-[#0CA851]" : "bg-[#B8B8B8]"
                      } relative inline-flex h-6 w-11 items-center rounded-full`}
                    >
                      <span className="sr-only">Enable notifications</span>
                      <span
                        className={`${
                          enabled ? "translate-x-6" : "translate-x-1"
                        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                      />
                    </Switch>
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        handleToggle();
                      }}
                    >
                      <svg
                        width="6"
                        height="21"
                        viewBox="0 0 6 21"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="2.83594"
                          cy="2.86066"
                          r="2.5"
                          fill="#0CA851"
                        />
                        <circle
                          cx="2.83594"
                          cy="10.3607"
                          r="2.5"
                          fill="#0CA851"
                        />
                        <circle
                          cx="2.83594"
                          cy="17.8607"
                          r="2.5"
                          fill="#0CA851"
                        />
                      </svg>
                    </div>
                  </div>
                  <div
                    className="px-2 py-1 rounded-2xl"
                    style={{ border: "1px solid #0CA851", display: disp }}
                  >
                    <div className="mb-2 cursor-pointer" onClick={openModal}>
                      Save as template
                    </div>
                    <hr />
                    <div className="text-center mt-2">Delete</div>
                  </div>
                </div>
              </div>
            </div>
            <Modal
              isOpen={open}
              onRequestClose={closeModal}
              style={customStyles}
              contentLabel="Example Modal"
            >
              <div className="text-2xl font-medium text-center">
                Save First as a template
              </div>
              <div className="text-[14px] text-[#838383] text-center mt-3">
                This will create a template from this monitor. Set a name and
                description for your template to continue.
              </div>
              <div className="mt-4 flex flex-col justfiy-center">
                <div className="text-lg">Name</div>
                <input
                  type="text"
                  className="px-3 text-base outline-none py-3 rounded-lg"
                  placeholder="Pause Detection template"
                  style={{ border: "1px solid #4C4C4C" }}
                />
              </div>
              <div className="mt-3 flex flex-col justfiy-center">
                <div className="text-lg">Description</div>
                <input
                  type="text"
                  placeholder="The monitor detects transfer events.."
                  className="px-3 text-base outline-none py-3 rounded-lg"
                  style={{ border: "1px solid #4C4C4C" }}
                />
              </div>
              <div className="text-center">
                <button
                  className="mt-5 px-5 py-2 text-white bg-[#0CA851] rounded-lg"
                  onClick={closeModal}
                >
                  Create Template
                </button>
              </div>
            </Modal>
          </div>
        );
      })}
    </div>
  );
};
export default Monitor_cmp;
