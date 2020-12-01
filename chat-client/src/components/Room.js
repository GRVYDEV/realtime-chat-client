import { useState, useEffect } from "react";
import React from "react";
import { Presence } from "phoenix";
import useChannel from "../hooks/useChannel";
let roomId = null;

// channel.on("presence_state", state => {
//     presences = Presence.syncState(presences, state);
//     displayUsers(presences);
//   })
//   channel.on("presence_diff", diff => {
//     presences = Presence.syncDiff(presences, diff);
//     displayUsers(presences);
//   })
// channel.on(`room:${roomId}:new_message`, (message) => {
//     console.log(message);
//     displayMessage(message, true);
//   })
let presences = {};
const initialState = {
  messages: new Array(),
  presences: new Object(),
};
const reducer = (state, { event, payload, roomID }) => {
  let newState = {
    messages: state.messages,
    presences: state.presences,
  };
  switch (event) {
    case "presence_state":
      newState.presences = Presence.syncState(state.presences, payload);
      break;

    case "presence_diff":
      newState.presences = Presence.syncDiff(state.presences, payload);
      break;

    case `room:${roomId}:new_message`:
      console.log("new message");
      newState.messages = [...state.messages, payload];
      break;

    case "connect":
      newState.messages = [].concat(payload);
      newState.messages.reverse();
      break;
  }
  console.log(state);

  return newState;
};

function Room({ roomID }) {
  roomId = roomID;
  console.log("room re render")
  useEffect(() => {
    roomId = roomID;
  }, [roomID]);
  const [state, broadcast] = useChannel(reducer, initialState, roomID);
  const [message, updateMessage] = useState("");

  function submitMessage() {
    broadcast("message:add", {
      message: message,
    });
    updateMessage("");
  }

  const onChange = (event) => {
    updateMessage(event.target.value);
  };
  let numUsers = 0;
  Presence.list(state.presences, (_id, { metas: [user, ...rest] }) => {
    numUsers++;
  });

  return (
    <div className="flex flex-col flex-auto h-full p-6">
      <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4 relative">
        <div class="my-auto flx-col flex justify-center absolute top-6 right-8">
          <span class="px-4 py-1  inline-flex text-lg leading-5 font-semibold rounded-full bg-gray-800 text-white">
            {numUsers}
            &nbsp;<span class="text-green-400 font-black ml-2">Online</span>
          </span>
        </div>
        <div className="flex flex-col h-full overflow-x-auto mb-4">
          <div className="flex flex-col h-full">
            <div className="grid grid-cols-12 gap-y-2">
              {state.messages.map((message) => (
                <div className="col-start-1 col-end-8 p-3 rounded-lg">
                  <div className="flex flex-row items-center">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                      {message.user.charAt(0)}
                    </div>
                    <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                      <h2 className="font-black mb-2">{message.user}</h2>
                      <div>{message.body}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
          <div>
            <button className="flex items-center justify-center text-gray-400 hover:text-gray-600">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                ></path>
              </svg>
            </button>
          </div>
          <div className="flex-grow ml-4">
            <div className="relative w-full">
              <input
                type="text"
                value={message}
                onChange={onChange}
                className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
              />
              <button className="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
          <div className="ml-4">
            <button
              className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
              onClick={submitMessage}
            >
              <span>Send</span>
              <span className="ml-2">
                <svg
                  className="w-4 h-4 transform rotate-45 -mt-px"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  ></path>
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Room;
