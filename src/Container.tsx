import React, { useState, useEffect } from 'react';
import useLocation from './useLocation';
import { EyeIcon, ProfileIcon, VideoIcon } from './icons';

type ChannelStats = {
  name: string;
  subscribers: number;
  joined: string;
  description: string;
  country: string;
  videos: number;
  views: number;
  iconUrl: string;
  url: string;
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
    padding: '12px',
    marginBottom: '10px',
    backgroundColor: 'rgba(52, 52, 52, 0.3)',
    borderRadius: '12px',
    color: 'white',
    fontSize: '16px',
    gap: '4px',
  };
  const wrapperStyle: React.CSSProperties = {
    display: 'inline-flex', 
    alignItems: 'center', 
    gap: '4px',
  };

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
        iconUrl: channelData.avatar[2].url,
        url: channelData.canonicalBaseUrl,
      });
    };

    fetchStats();
  }, [location]);

  return (
    <div style={containerStyle}>
      {stats ? (
        <>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '24px' }}>
                <b>{stats.name} <a style={{ all: 'unset', cursor: 'pointer' }} target='_blank' href={`https://www.youtube.com${stats.url}`}>🔗</a></b>
              </span>
              <div style={{ display: 'flex' }}>
                <span><b>Member since:</b> {stats.joined.replace('Joined ', '')}</span>
                <span><b>Country:</b> {stats.country}</span>
              </div>
            </div>
            <img
              style={{ borderRadius: '12px' }}
              height={80} 
              width={80} 
              src={stats.iconUrl} 
              alt='Avatar' 
            />
          </div>

          <br />

          <div style={wrapperStyle}>
            <ProfileIcon />
            <span><b>Subs:</b> {stats.subscribers}</span>
          </div>
          <div style={wrapperStyle}>
            <VideoIcon />
            <span><b>Videos:</b> {stats.videos}</span>
          </div>
          <div style={wrapperStyle}>
            <EyeIcon />
            <span><b>Views:</b> {stats.views}</span>
          </div>

          <br />

          <span>
            <b>Description:</b>
            <br />
            {stats.description}
          </span>
        </>
      ) : (
        <span>Loading...</span>
      )}
    </div>
  );
};

export default Container;
