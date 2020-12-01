import { useContext, useEffect, useReducer, useState } from "react";
import SocketContext from "../contexts/SocketContext";
const channelTopic = (roomid) => {
  return `room:${roomid}`;
};
const useChannel = (reducer, initialState, roomID) => {
  const socket = useContext(SocketContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [broadcast, setBroadcast] = useState(mustJoinChannelWarning);

  useEffect(() => joinChannel(socket, dispatch, setBroadcast, roomID), [
    roomID,
  ]);

  return [state, broadcast];
};

const joinChannel = (socket, dispatch, setBroadcast, roomID) => {
  const channel = socket.channel(channelTopic(roomID), { client: "browser" });

  channel.onMessage = (event, payload) => {
    dispatch({ event, payload, roomID });
    return payload;
  };

  channel
    .join()
    .receive("ok", ({ messages }) => {
      console.log("successfully joined channel", messages || "");
      dispatch({ event: "connect", payload: messages });
    })
    .receive("error", ({ reason }) =>
      console.error("failed to join channel", reason)
    );

  setBroadcast(() => channel.push.bind(channel));

  return () => {
    channel.leave();
  };
};

const mustJoinChannelWarning = () => () =>
  console.error(
    `useChannel broadcast function cannot be invoked before the channel has been joined`
  );

export default useChannel;
