/** @format */

import { IntranetPost } from "../_types/intranet";
import bannerComunicado from "../feed/_temp-assets/banner-comunicado.png";
import newsPhoto1 from "../feed/_temp-assets/news-photo-1.png";

export const mockPosts: IntranetPost[] = [
  {
    id: 1,
    author: "Coordenadoria de Comunicacao",
    cargo: "Comunicacao SMUL",
    time: "ha 1h",
    type: "comunicado",
    text: "Ja conferiu se o seu cadastro esta atualizado? Atualize seus dados de contato no portal do servidor para mantermos uma comunicacao assertiva. E simples e rapido!",
    image: bannerComunicado,
    likes: 34,
    likedByMe: false,
    comments: [
      {
        id: 1,
        author: "Sandra Maria Coelho Cruz",
        text: "Feito! Muito importante essa atualizacao.",
        initials: "SC",
        avatarColor: "#8B5CB0",
      },
    ],
  },
  {
    id: 2,
    author: "Ingrid Jesus Costa",
    cargo: "Divisao de Gestao de Pessoas",
    time: "ha 3h",
    type: "kudos",
    text: "Quero reconhecer o time da CASE pelo excelente trabalho na migracao do sistema de licenciamento este mes. Dedicacao exemplar!",
    image: null,
    likes: 21,
    likedByMe: true,
    comments: [],
  },
  {
    id: 3,
    author: "Urbanismo em Pauta",
    cargo: "Cultura urbana",
    time: "ha 5h",
    type: "comum",
    text: "Papo Urbano deste mes: uma releitura visual da regiao central de Sao Paulo. Confira a materia completa na aba Comunicados.",
    image: newsPhoto1,
    likes: 12,
    likedByMe: false,
    comments: [],
  },
  {
    id: 4,
    author: "Rogerio do N. Goncalves",
    cargo: "RESID",
    time: "ha 1 dia",
    type: "vaga",
    text: "Estamos com uma vaga interna aberta na Coordenadoria de Licenciamento para analista pleno. Interessados podem procurar a DSIGP ate sexta-feira.",
    image: null,
    likes: 8,
    likedByMe: false,
    comments: [],
  },
  {
    id: 5,
    author: "Coordenadoria de Tecnologia da Informacao",
    cargo: "TI - Suporte",
    time: "ha 2 dias",
    type: "conquista",
    text: "Celebramos 3 anos do GeoSampa 2.0 no ar, com mais de 40 mil acessos mensais. Obrigado a todos que tornaram esse projeto possivel!",
    image: null,
    likes: 45,
    likedByMe: false,
    comments: [],
  },
];
