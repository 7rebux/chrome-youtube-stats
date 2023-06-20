import React, { useState, useEffect } from 'react';

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

const Container: React.FC = () => {
  const [stats, setStats] = useState<ChannelStats>(
    {
      name: 'Loading..',
      subscribers: -1,
      joined: 'Loading..',
      description: 'Loading..',
      country: 'Loading..',
      videos: -1,
      views: -1,
      iconUrl: '',
    }
  );

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
    const videoId = document.querySelector('meta[itemprop="identifier"]').getAttribute('content');
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
  }, [window.location]);

  return (
    <div style={containerStyle}>
      <span>Channel: {stats.name}</span>
      <span>Subscribers: {stats.subscribers}</span>
      <span>Joined: {stats.joined}</span>
      <span>Description: {stats.description}</span>
      <span>Country: {stats.country}</span>
      <span>Videos: {stats.videos}</span>
      <span>Views: {stats.views}</span>
      <img height={64} width={64} src={stats.iconUrl} alt='Avatar' />
    </div>
  );
};

export default Container;
