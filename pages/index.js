import { useState } from 'react'
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
        {data.map(({ id, title, url, image }) => (
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

export default function Home() {
  const [comunidades, setComunidades] = useState([{
    id: new Date().toISOString(),
    title: 'Eu Odeio Acordar Cedo',
    image: 'https://alurakut.vercel.app/capa-comunidade-01.jpg',
    url: "#"
  }])
  const githubUser = 'mitestainer'
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

  const handleSubmit = e => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const comunidade = {
      id: new Date().toISOString(),
      title: formData.get('title'),
      image: formData.get('image')
    }
    setComunidades([...comunidades, comunidade])
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
          <ProfileRelationsBox title="Pessoas da Comunidade" data={pessoasFavoritas} />
          <ProfileRelationsBox title="Comunidades" data={comunidades} />
        </div>
      </MainGrid>
    </>
  )
}
