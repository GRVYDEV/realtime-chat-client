import "./assets/main.css";
import { Socket, Presence } from "phoenix";
import { useQuery, createClient, Provider } from "urql";
import Room from "./components/Room.js";
import { useState, useEffect } from "react";

const RoomsQuery = `
  query {
    rooms {
      id
      name
    }
  }
`;

function App() {
  const [result, reexecuteQuery] = useQuery({
    query: RoomsQuery,
  });

  const [roomID, changeRoomID] = useState(null);

  const { data, fetching, error } = result;
  console.log("parent rerender");
  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  return (
    <div className="App">
      <div className="flex h-screen antialiased text-gray-800">
        <div className="flex flex-row h-full w-full overflow-x-hidden">
          <div className="flex flex-col py-8 pl-6 pr-2 w-64 bg-white flex-shrink-0">
            <div className="flex flex-row items-center justify-center h-12 w-full">
              <div className="flex items-center justify-center rounded-2xl text-indigo-700 bg-indigo-100 h-10 w-10">
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
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  ></path>
                </svg>
              </div>
              <div className="ml-2 font-bold text-2xl">QuickChat</div>
            </div>

            <div className="flex flex-col mt-8">
              <div className="flex flex-row items-center justify-between text-xs">
                <span className="font-bold">Rooms</span>
                <span className="flex items-center justify-center bg-gray-300 h-4 w-4 rounded-full">
                  {data.rooms.length}
                </span>
              </div>
              <div className="flex flex-col space-y-1 mt-4 -mx-2 h-48 overflow-y-auto">
                {data.rooms.map((room) => (
                  <button
                    className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2"
                    key={room.id}
                    onClick={() => {
                      console.log(room.id);
                      changeRoomID(room.id);
                    }}
                  >
                    <div className="flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full">
                      {room.name.charAt(0)}
                    </div>
                    <div className="ml-2 text-sm font-semibold">
                      {room.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          {roomID ? <Room roomID={roomID} /> : <h1>Join a room</h1>}
        </div>
      </div>
    </div>
  );
}

export default App;
