import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { Typography, Spin, Alert, Descriptions, List } from 'antd';
import { LikeOutlined, LikeTwoTone, DislikeOutlined, DislikeTwoTone } from '@ant-design/icons';
import BaseLayout from '../components/BaseLayout';
import useUserData from '../hook/useUserData';

import '../styles/PersonPage.css';

const { Title } = Typography;

function PersonProfile() {
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [acted_movies, setActedMovies] = useState(null);
  const [directed_movies, setDirectedMovies] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setlikeCount] = useState({likes : 0, dislikes: 0});
  const { personId } = useParams();
  const user = useUserData();

  useEffect(() => {
    if (!user) return; // If user is not available, do nothing

    async function fetchData() {
      try {
        const personResponse = await axios.get(`http://localhost:3000/person/${encodeURIComponent(personId)}`);
        setPerson(personResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch person:', error);
      }

      try {
        const actedMoviesResponse = await axios.get(`http://localhost:3000/person/${encodeURIComponent(personId)}/acted_movies`);
        setActedMovies(actedMoviesResponse.data);
      } catch (error) {
        console.error('Failed to fetch acted movies:', error);
      }

      try {
        const directedMoviesResponse = await axios.get(`http://localhost:3000/person/${encodeURIComponent(personId)}/directed_movies`);
        setDirectedMovies(directedMoviesResponse.data);
      } catch (error) {
        console.error('Failed to fetch directed movies:', error);
      }

      try {
        const likeStatusResponse = await axios.get(`http://localhost:3000/entity/${encodeURIComponent(personId)}/react/${encodeURIComponent(user.id)}`);
        if(likeStatusResponse.data === 1 || likeStatusResponse.data === 0){
          console.log(likeStatusResponse.data === 1)
          setIsLiked(likeStatusResponse.data === 1);
        }
        else {
          setIsLiked(null);
        }
      } catch (error) {
        console.error('Failed to fetch like status:', error);
      }

      try {
        const likeCountResponse = await axios.get(`http://localhost:3000/entity/${encodeURIComponent(personId)}/reactions`);
        setlikeCount(likeCountResponse.data);
        console.log("Like Count: " + likeCountResponse.data)
      } catch (error) {
        console.error('Failed to fetch like count:', error);
      }
    }

    fetchData();
  }, [user, personId]);


  if (loading) {
    return (
      <BaseLayout>
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <Spin size="large" />
        </div>
      </BaseLayout>
    );
  }

  const handleLike = async () => {
    // if its liked, and it clicks on like, so removes the like
    if(isLiked){
      await axios.delete(`http://localhost:3000/entity/${encodeURIComponent(personId)}/react/${encodeURIComponent(user.id)}`);
      setIsLiked(null)
      setlikeCount(prevCount => ({...prevCount, likes: prevCount.likes - 1}));

    }
    else {
      axios.post(`http://localhost:3000/entity/${encodeURIComponent(personId)}/react/${encodeURIComponent(user.id)}`, { like: 1  })
      .then(() => {
        setIsLiked(true);
        if(isLiked === false){
          setlikeCount(prevCount => ({...prevCount, dislikes: prevCount.dislikes - 1, likes: prevCount.likes + 1}));
        }
        else {
          setlikeCount(prevCount => ({...prevCount, likes: prevCount.likes + 1}));
        }
      })
      .catch(error => console.error('Failed to update like status:', error));
    }

  };

  const handleDislike = async () => {
    // if its disliked, and it clicks on dislike, so it removes the dislike
    if(isLiked === false){
      axios.delete(`http://localhost:3000/entity/${encodeURIComponent(personId)}/react/${encodeURIComponent(user.id)}`)
      .then(() => {
        setIsLiked(null);
        setlikeCount(prevCount => ({...prevCount, dislikes: prevCount.dislikes - 1}));
      })
      .catch(error => console.error('Failed to update like status:', error));
      
    }
    else {
      axios.post(`http://localhost:3000/entity/${encodeURIComponent(personId)}/react/${encodeURIComponent(user.id)}`, { like: 0  })
      .then(() => {
        if(isLiked === true){
          setlikeCount(prevCount => ({...prevCount, dislikes: prevCount.dislikes + 1, likes: prevCount.likes - 1}));
        }
        else {
          setlikeCount(prevCount => ({...prevCount, dislikes: prevCount.dislikes + 1}));
        }
        setIsLiked(false);
      })
      .catch(error => console.error('Failed to update like status:', error));
    }

  };

  return (
    <BaseLayout>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>

        {person ? (
          <Descriptions title={person.name}>
            <Descriptions.Item label="Birthday">{person.birthday ? new Date(parseInt(person.birthday)).toDateString() : "N/A"}</Descriptions.Item>
            <Descriptions.Item label="Birthplace">{person.birthplace ? person.birthplace : "N/A"}</Descriptions.Item>
            <br></br>
            <Descriptions.Item label="Biography">{person.biography ? person.biography : "N/A"}</Descriptions.Item>


          </Descriptions>
        ) : (
          <Alert message="Person not found" type="error" />
        )}

        <div style={{ display: 'inline-flex', alignItems: 'center', background: '#f0f0f0', borderRadius: 20, padding: '6px 15px' }}>
          {isLiked === true ? (
            <>
              <LikeTwoTone style={{ fontSize: 20, cursor: 'pointer' }} onClick={handleLike} />
              <span style={{ marginLeft: 7 }}>{likeCount.likes}</span>
              <div style={{ borderLeft: '1px solid lightgrey', height: 18, margin: '0 10px' }}></div>
              <span style={{ marginRight: 7 }}>{likeCount.dislikes}</span>
              <DislikeOutlined style={{ fontSize: 20, color: 'grey', cursor: 'pointer' }} onClick={handleDislike} />
            </>
          ) : isLiked === false ? (
            <>
              <LikeOutlined style={{ fontSize: 20, color: 'grey', cursor: 'pointer' }} onClick={handleLike} />
              <span style={{ marginLeft: 7 }}>{likeCount.likes}</span>
              <div style={{ borderLeft: '1px solid lightgrey', height: 18, margin: '0 10px' }}></div>
              <span style={{ marginRight: 7 }}>{likeCount.dislikes}</span>
              <DislikeTwoTone style={{ fontSize: 20, cursor: 'pointer' }} onClick={handleDislike} />
            </>
          ) : (
            <>
              <LikeOutlined style={{ fontSize: 20, color: 'grey', cursor: 'pointer' }} onClick={handleLike} />
              <span style={{ marginLeft: 7 }}>{likeCount.likes}</span>
              <div style={{ borderLeft: '1px solid lightgrey', height: 18, margin: '0 10px' }}></div>
              <span style={{ marginRight: 7 }}>{likeCount.dislikes}</span>
              <DislikeOutlined style={{ fontSize: 20, color: 'grey', cursor: 'pointer' }} onClick={handleDislike} />
            </>
          )}
        </div>
        {acted_movies && acted_movies.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <Title level={5}>Acted in</Title>
            <List
              bordered
              dataSource={acted_movies}
              renderItem={movie => (
                <List.Item>
                  <Link to={`/movie/${encodeURIComponent(movie._id)}`}>{movie.label}</Link>
                </List.Item>
              )}
            />
          </div>
        )}
        {directed_movies && directed_movies.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <Title level={5}>Directed</Title>
            <List
              bordered
              dataSource={directed_movies}
              renderItem={movie => (
                <List.Item>
                  <Link to={`/movie/${encodeURIComponent(movie._id)}`}>{movie.label}</Link>
                </List.Item>
              )}
            />
          </div>
        )}
      </div>

    </BaseLayout>
  );
}

export default PersonProfile;
