import Link from "next/link";

const copy = {
  en: {
    title: "Arrumo documentation",
    lead: "Arrumo is a desktop video editor where an AI agent drafts, cuts and renders your videos, and you review every step.",
    sections: [
      {
        href: "docs/user",
        title: "Use Arrumo",
        body: "Set up a workspace, make your first video and export it.",
      },
      {
        href: "docs/developer",
        title: "Build on Arrumo",
        body: "Connect through the CLI, MCP or A2A, and write plugins with the SDK.",
      },
      {
        href: "docs/plugins",
        title: "Official plugins",
        body: "Set up the agents and media providers Arrumo ships with.",
      },
    ],
    agents: "For AI agents",
    company: "Made by DEVS AI. Need a custom AI solution?",
  },
  es: {
    title: "Documentación de Arrumo",
    lead: "Arrumo es un editor de vídeo de escritorio en el que un agente de IA redacta, corta y renderiza tus vídeos, y tú revisas cada paso.",
    sections: [
      {
        href: "docs/user",
        title: "Usar Arrumo",
        body: "Configura un espacio de trabajo, crea tu primer vídeo y expórtalo.",
      },
      {
        href: "docs/developer",
        title: "Desarrollar con Arrumo",
        body: "Conéctate por CLI, MCP o A2A y crea complementos con el SDK.",
      },
      {
        href: "docs/plugins",
        title: "Complementos oficiales",
        body: "Configura los agentes y proveedores multimedia que incluye Arrumo.",
      },
    ],
    agents: "Para agentes de IA",
    company: "Hecho por DEVS AI. ¿Necesitas una solución de IA a medida?",
  },
  pt: {
    title: "Documentação do Arrumo",
    lead: "O Arrumo é um editor de vídeo para computador em que um agente de IA escreve, corta e renderiza os teus vídeos, e tu revês cada passo.",
    sections: [
      {
        href: "docs/user",
        title: "Usar o Arrumo",
        body: "Configura um espaço de trabalho, cria o teu primeiro vídeo e exporta-o.",
      },
      {
        href: "docs/developer",
        title: "Desenvolver com o Arrumo",
        body: "Liga-te por CLI, MCP ou A2A e cria plugins com o SDK.",
      },
      {
        href: "docs/plugins",
        title: "Plugins oficiais",
        body: "Configura os agentes e fornecedores multimédia incluídos no Arrumo.",
      },
    ],
    agents: "Para agentes de IA",
    company: "Feito pela DEVS AI. Precisas de uma solução de IA à medida?",
  },
};

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  const text = copy[lang as keyof typeof copy] ?? copy.en;
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-4 py-16">
      <header className="flex flex-col gap-3">
        <h1 className="text-4xl font-semibold tracking-tight">{text.title}</h1>
        <p className="max-w-2xl text-lg text-fd-muted-foreground">
          {text.lead}
        </p>
      </header>
      <ul className="grid gap-4 sm:grid-cols-3">
        {text.sections.map((section) => (
          <li key={section.href}>
            <Link
              href={`/${lang}/${section.href}`}
              className="flex h-full flex-col gap-2 rounded-xl border bg-fd-card p-5 transition-colors hover:bg-fd-accent"
            >
              <span className="font-semibold">{section.title}</span>
              <span className="text-sm text-fd-muted-foreground">
                {section.body}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="text-sm text-fd-muted-foreground">
        {text.agents}:{" "}
        <a
          className="underline"
          href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/${lang}/llms.txt`}
        >
          llms.txt
        </a>{" "}
        ·{" "}
        <a
          className="underline"
          href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/${lang}/llms-full.txt`}
        >
          llms-full.txt
        </a>
      </p>
      <p className="text-sm text-fd-muted-foreground">
        {text.company}{" "}
        <a className="underline" href="https://aidevs.pt">
          aidevs.pt
        </a>
      </p>
    </main>
  );
}
