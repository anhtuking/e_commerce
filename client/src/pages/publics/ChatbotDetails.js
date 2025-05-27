import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { setActiveChatId, setModalOpen } from "store/chat/chatSlice";
import withBase from "hocs/withBase";

const ChatDetail = ({ dispatch, navigate }) => {
  const [dataDetail, setDataDetail] = useState([]);
  const [messageDetail, setMessageDetail] = useState([]);
  const messagesEndRef = useRef(null);
  const { id } = useParams();
  const { data } = useSelector((state) => state.chat);

  useEffect(() => {
    if (data?.length > 0) {
      const chat = data.find((chat) => chat.id === id);
      if (chat) {
        setDataDetail(chat);
        setMessageDetail(chat.messages);
      }
    }
  }, [data, id]);

  useEffect(() => {
    scrollToBottom();
  }, [messageDetail]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (id) {
      const isValidId = data.some(chat => chat.id === id);
      if (isValidId) {
        dispatch(setActiveChatId(id));
      } else if (data.length > 0) {
        dispatch(setActiveChatId(data[0].id));
      }
    }
    dispatch(setModalOpen(true));
    navigate('/');
  }, [id, data, dispatch, navigate]);
  return null;
};

export default withBase(ChatDetail);