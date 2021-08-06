import { useEffect, useState } from 'react'
import nookies from 'nookies'
import jwt from 'jsonwebtoken'
import { MainGrid } from '../src/components/MainGrid'
import { Box } from '../src/components/Box'
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AluraCommons'
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations'

const ProfileSidebar = ({ githubUser }) => {
  return (
    <Box as="aside">
      <img src={`https://github.com/${githubUser}.png`} style={{ borderRadius: '8px' }} />
      <hr />
      <p>
        <a className="boxLink" href={`https://github.com/${githubUser}`}>@{githubUser}</a>
      </p>
      <hr />
      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

const ProfileRelationsBox = ({ title, data }) => {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {title} ({data.length})
      </h2>
      <ul>
        {data.slice(0, 6).map(({ id, title, url, image }) => (
          <li key={id}>
            <a href={url}>
              <img src={image} />
              <span>{title}</span>
            </a>
          </li>
        ))}
      </ul>
    </ProfileRelationsBoxWrapper>
  )
}

export default function Home(props) {
  const [comunidades, setComunidades] = useState([])
  const githubUser = props.githubUser
  const pessoasFavoritas = [
    {
      id: 'juunegreiros',
      title: 'juunegreiros',
      image: 'https://github.com/juunegreiros.png',
      url: "https://github.com/juunegreiros"
    },
    {
      id: 'omariosouto',
      title: 'omariosouto',
      image: 'https://github.com/omariosouto.png',
      url: "https://github.com/omariosouto"
    },
    {
      id: 'peas',
      title: 'peas',
      image: 'https://github.com/peas.png',
      url: "https://github.com/peas"
    },
    {
      id: 'rafaballerini',
      title: 'rafaballerini',
      image: 'https://github.com/rafaballerini.png',
      url: "https://github.com/rafaballerini"
    },
    {
      id: 'marcobrunodev',
      title: 'marcobrunodev',
      image: 'https://github.com/marcobrunodev.png',
      url: "https://github.com/marcobrunodev"
    },
    {
      id: 'felipefialho',
      title: 'felipefialho',
      image: 'https://github.com/felipefialho.png',
      url: "https://github.com/felipefialho"
    }
  ]

  const [seguidores, setSeguidores] = useState([])
  const getSeguidores = async () => {
    await fetch(`https://api.github.com/users/${githubUser}/followers`)
      .then(res => res.json())
      .then(data => {
        const mappedData = data.map(user => {
          return {
            id: user.id,
            title: user.login,
            url: user.html_url,
            image: `https://github.com/${user.login}.png`
          }
        })
        setSeguidores(mappedData)
      })
  }
  const getDataFromDatoCMS = () => {
    const token = 'b64c89fad42305a8f6a7270e75ba4c'
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: `query {
          allCommunities {
            id
            title
            imageUrl
            creatorSlug
          }
        }`
      })
    }).then(res => res.json())
      .then(({ data }) => {
        const mappedData = data.allCommunities.map(community => {
          return {
            id: community.id,
            title: community.title,
            url: '#',
            image: community.imageUrl
          }
        })
        setComunidades(mappedData)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    getSeguidores()
    getDataFromDatoCMS()
  }, [])

  const handleSubmit = e => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const comunidade = {
      title: formData.get('title'),
      imageUrl: formData.get('image'),
      creatorSlug: githubUser
    }
    fetch('/api/comunidades', {
      method: 'POST',
      body: JSON.stringify(comunidade),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(async res => {
        const dados = await res.json()
        const novaComunidade = {
          title: dados.registroCriado.title,
          image: dados.registroCriado.imageUrl,
          creatorSlug: dados.registroCriado.creatorSlug
        }
        setComunidades([...comunidades, novaComunidade])
      })
  }

  return (
    <>
      <AlurakutMenu githubUser={githubUser} />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={githubUser} />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">
              Bem-vindo(a)
            </h1>
            <OrkutNostalgicIconSet />
          </Box>
          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <input
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                />
              </div>
              <div>
                <input
                  placeholder="Coloque uma URL para usarmos de capa"
                  name="image"
                  aria-label="Coloque uma URL para usarmos de capa"
                />
              </div>
              <button type="submit">
                Criar comunidade
              </button>
            </form>
          </Box>
        </div>
        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
          <ProfileRelationsBox title="Meus seguidores" data={seguidores} />
          <ProfileRelationsBox title="Pessoas da Comunidade" data={pessoasFavoritas} />
          <ProfileRelationsBox title="Comunidades" data={comunidades} />
        </div>
      </MainGrid>
    </>
  )
}

export async function getServerSideProps(context) {
  const cookies = nookies.get(context)
  const token = cookies.USER_TOKEN

  const { isAuthenticated } = await fetch('https://alurakut.vercel.app/api/auth', {
    headers: {
      Authorization: token
    }
  }).then(res => res.json())

  if (!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }

  const { githubUser } = jwt.decode(token)

  return {
    props: {
      githubUser
    },
  }
}