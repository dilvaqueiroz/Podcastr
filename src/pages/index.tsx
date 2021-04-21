//import { useEffect } from "react"
import {GetStaticProps} from 'next';
import {format, parseISO} from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';

import styles from './home.module.scss';

type Episode = {
  id: string;
  title: string;
  thumbnail:string;
  description: string;
  members: string;
  duration: number;
  durationAsString: string;
  url: string;
  published_at: string;
   // ...
}
type HomeProps = {
  latestEpisodes: Episode [];
  allEpisodes: Episode [];
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  //SPA
 /* useEffect(()=>{
    fetch('http://localhost:3333/episodes')
    .then(response => response.json())
    .then(data => console.log(data))
  },[])*/

  console.log(latestEpisodes)

  return (
    <div className={styles.homepage}>
     <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>
        <ul>
          {latestEpisodes.map(episode =>{
            return(
              <li>
                <a href="">{episode.title}</a>
              </li>
            )
          })}
        </ul>
     </section>

     <section className={styles.allEpisodes}>

     </section>
    </div>
  )
}

//SSR export async function getServerSideProps(){

//SSG
export const getStaticProps : GetStaticProps = async () => {
    const {data}= await api.get('episodes',{
      params:{
        _limit: 12,
        _sort: 'published_at',
        _order: 'desc'
      }
    })

    const episodes = data.map(episode => {
      return{
        id: episode.id,
        title: episode.title,
        thumbnail: episode.thumbnail,
        members: episode.members,
        publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {locale: ptBR}),
        duration: Number(episode.file.duration),
        durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
        description: episode.description,
        url: episode.file.url,
      };
    })


    const latestEpisodes = episodes.slice(0,2);
    const allEpisodes = episodes.slice(2,episodes.length)

    return {
      props: {
        latestEpisodes,
        allEpisodes
      },
      revalidate: 60 * 60 * 8,
    }
}