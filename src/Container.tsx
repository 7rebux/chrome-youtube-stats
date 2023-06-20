import React, { useState, useEffect } from 'react';
import useLocation from './useLocation';

type ChannelStats = {
  name: string;
  subscribers: number;
  joined: string;
  description: string;
  country: string;
  videos: number;
  views: number;
  iconUrl: string;
};

const parseVideoId = (url: string) => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);

  return (match && match[7].length == 11) ? match[7] : false;
}

const Container: React.FC = () => {
  const location = useLocation();

  const [stats, setStats] = useState<ChannelStats | undefined>(undefined);

  const containerStyle: React.CSSProperties = {
    display: 'flex', 
    flexDirection: 'column',
    padding: '8px',
    marginBottom: '10px',
    backgroundColor: '#2a2929',
    borderRadius: '12px',
    color: 'white',
    fontSize: '16px',
    gap: '4px',
  }

  useEffect(() => {
    setStats(undefined);

    const videoId = parseVideoId(location);

    if (videoId === false) return;

    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': process.env.API_KEY,
        'X-RapidAPI-Host': 'youtube138.p.rapidapi.com'
      }
    };
    
    const fetchStats = async () => {
      const videoResponse = await fetch(`https://youtube138.p.rapidapi.com/video/details/?id=${videoId}`, options);
      const videoData = await videoResponse.json();

      const channelId = videoData.author.channelId;

      const channelResponse = await fetch(`https://youtube138.p.rapidapi.com/channel/details/?id=${channelId}`, options);
      const channelData = await channelResponse.json();

      setStats({
        name: channelData.title,
        subscribers: channelData.stats.subscribers,
        joined: channelData.joinedDateText,
        description: channelData.description,
        country: channelData.country,
        videos: channelData.stats.videos,
        views: channelData.stats.views,
        iconUrl: channelData.avatar[0].url
      });
    };

    fetchStats();
  }, [location]);

  return (
    <div style={containerStyle}>
      {stats ? (
        <>
          <span><b>Channel:</b> {stats.name}</span>
          <span><b>Subscribers:</b> {stats.subscribers}</span>
          <span><b>Joined:</b> {stats.joined}</span>
          <span><b>Description:</b> {stats.description}</span>
          <span><b>Country:</b> {stats.country}</span>
          <span><b>Videos:</b> {stats.videos}</span>
          <span><b>Views:</b> {stats.views}</span>
          <img height={64} width={64} src={stats.iconUrl} alt='Avatar' />
        </>
      ) : (
        <span>Loading...</span>
      )}
    </div>
  );
};

export default Container;
