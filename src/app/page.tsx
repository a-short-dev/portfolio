import HireMeForm from "@/components/hire-me-form";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { BsUbuntu } from "react-icons/bs";
import { DiReact } from "react-icons/di";
import {
  FaDocker,
  FaGit,
  FaHtml5,
  FaJava,
  FaLinkedinIn,
  FaNodeJs,
  FaPhp,
  FaXTwitter,
} from "react-icons/fa6";
import { IoLogoJavascript } from "react-icons/io";
import { RiTailwindCssLine } from "react-icons/ri";
import { SiAndroidstudio, SiNestjs, SiNginx } from "react-icons/si";
import { TbBrandReactNative } from "react-icons/tb";

const Projects: ProductCardProps[] = [
  {
    url: "https://freelance-pro-six.vercel.app",
    title: "Freelance Pro",
    description: "Invoice generating and tracking",
    img: "/projects/freelance.png",
    type: "personal",
    techStack: ["NextJS"],
    status: "ongoing",
  },
  {
    url: "https://cona.vercel.app/",
    title: "Cona",
    description: "Demo webiste for nft",
    img: "/projects/cona.png",
    type: "personal",
    techStack: ["NextJS", "Chakra UI"],
  },
  {
    url: "https://www.npmjs.com/package/fintava",
    title: "Fintava SDK Libray",
    description: "Open source library for fintava payment gatewatey.",
    img: "/projects/fintava.png",
    type: "opensource",
  },

  {
    url: "https://20firstyling.vercel.app",
    title: "TwentyFirst Styling",
    description: "E-commerce store for fashion Desgin",
    img: "/projects/twenty.png",
    type: "contract",
    status: "maintenance",
    techStack: ["NextJS", "PostgresDB", "Redis"],
  },
  {
    url: "https://bestrates-frontend.vercel.app",
    title: "BestRates Digitals",
    description: "WebApp for giftcard and crypto trading",
    img: "/projects/best.png",
    type: "contract",
    techStack: ["NextJS", "PostgresDB", "Redis", "NestJS", "Docker"],
    status: "maintenance",
  },
];

export default function Home() {
  return (
    <div className='p-5  w-full max-w-6xl mx-auto'>
      <main>
        <section className='w-full flex items-center min-h-[70svh] justify-center  top-20 relative'>
          <div>
            <h1 className='text-5xl text-white lg:text-7xl mb-2 font-marlish font-semibold'>
              Hi I&apos;m Oluwaleke!
            </h1>
            <p className='text-base text-balance w-4/5 md:text-lg text-gray-200 font-sans font-medium'>
              Full-stack developer passionate about building scalable and
              high-performance applications. Experienced in web, mobile, and
              backend development, with a strong focus on{" "}
              <span className='text-gray-500'>
                architecture, performance, and DevOps.
              </span>
            </p>

            <p className='text-base font-marlish text-gray-200'>
              Curious to how things work, user eccentric full-stack developer,
              team leader, always ready learn and build amazing products.
            </p>
            <div className='flex items-center gap-2 mt-6'>
              <Link
                href='https://github.com/a-short-dev'
                className='flex items-center text-white bg-gray-800 w-min p-5 justify-center rounded-lg text-xl font-semibold max-w-sm wpfull shadow-lg'
              >
                <FaGit />
              </Link>
              <Link
                href='https://www.linkedin.com/in/ashortdev/'
                className='flex items-center text-white bg-gray-800 w-min p-5 justify-center rounded-lg text-xl font-semibold max-w-sm wpfull shadow-lg'
              >
                <FaLinkedinIn />
              </Link>

              <Link
                href='https://x.com/a_short_dev'
                className='flex items-center text-white bg-gray-800 w-min p-5 justify-center rounded-lg text-xl font-semibold max-w-sm wpfull shadow-lg'
              >
                <FaXTwitter />
              </Link>
            </div>
          </div>
        </section>

        <section className='space-y-10 mt-20 relative'>
          <h4 className='text-3xl font-sans font-semibold text-gray-500'>
            PROJECTS
          </h4>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2  md:gap-3 lg:grid-cols-3 w-full'>
            {Projects.map((project) => (
              <ProjectCard
                key={project.title}
                title={project.title}
                img={project.img}
                url={project.url}
                description={project.description}
                type={project.type}
                status={project.status}
                techStack={project.techStack}
              />
            ))}
          </div>
        </section>

        <section
          className='space-y-10 py-20'
          id='skills-and-tools'
        >
          <h4 className='text-3xl font-sans font-semibold text-gray-500'>
            SKILLS &amp; TOOLS
          </h4>
          <div className='flex flex-wrap gap-4 items- justify-center md:gap-9 w-full'>
            <div className='flex items-center text-white bg-gray-800 w-min p-5 justify-center rounded-lg text-4xl font-semibold max-w-sm wpfull shadow-lg'>
              <FaHtml5 />
            </div>
            <div className='flex items-center text-white bg-gray-800 w-min p-5 justify-center rounded-lg text-4xl font-semibold max-w-sm wpfull shadow-lg'>
              <IoLogoJavascript />
            </div>
            <div className='flex items-center text-white bg-gray-800 w-min p-5 justify-center rounded-lg text-4xl font-semibold max-w-sm wpfull shadow-lg'>
              <FaJava />
            </div>
            <div className='flex items-center text-white bg-gray-800 w-min p-5 justify-center rounded-lg text-4xl font-semibold max-w-sm wpfull shadow-lg'>
              <FaGit />
            </div>
            <div className='flex items-center text-white bg-gray-800 w-min p-5 justify-center rounded-lg text-4xl font-semibold max-w-sm wpfull shadow-lg'>
              <DiReact />
            </div>
            <div className='flex items-center text-white bg-gray-800 w-min p-5 justify-center rounded-lg text-4xl font-semibold max-w-sm wpfull shadow-lg'>
              <FaNodeJs />
            </div>{" "}
            <div className='flex items-center text-white bg-gray-800 w-min p-5 justify-center rounded-lg text-4xl font-semibold max-w-sm wpfull shadow-lg'>
              <RiTailwindCssLine />
            </div>
            <div className='flex items-center text-white bg-gray-800 w-min p-5 justify-center rounded-lg text-4xl font-semibold max-w-sm wpfull shadow-lg'>
              <FaPhp />
            </div>
            <div className='flex items-center text-white bg-gray-800 w-min p-5 justify-center rounded-lg text-4xl font-semibold max-w-sm wpfull shadow-lg'>
              <TbBrandReactNative />
            </div>
            <div className='flex items-center text-white bg-gray-800 w-min p-5 justify-center rounded-lg text-4xl font-semibold max-w-sm wpfull shadow-lg'>
              <SiNestjs />
            </div>
            <div className='flex items-center text-white bg-gray-800 w-min p-5 justify-center rounded-lg text-4xl font-semibold max-w-sm wpfull shadow-lg'>
              <SiAndroidstudio />
            </div>
            <div className='flex items-center text-white bg-gray-800 w-min p-5 justify-center rounded-lg text-4xl font-semibold max-w-sm wpfull shadow-lg'>
              <BsUbuntu />
            </div>
            <div className='flex items-center text-white bg-gray-800 w-min p-5 justify-center rounded-lg text-4xl font-semibold max-w-sm wpfull shadow-lg'>
              <SiNginx />
            </div>
            <div className='flex items-center text-white bg-gray-800 w-min p-5 justify-center rounded-lg text-4xl font-semibold max-w-sm wpfull shadow-lg'>
              <FaDocker />
            </div>
          </div>
        </section>

        <section className='space-y-10 py-20'>
          <h4 className='text-3xl font-sans font-semibold text-gray-500'>
            Abilities
          </h4>
          <div className='grid font-marlish grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
            {[
              "Full-Stack Development – Building scalable web and mobile applications with modern frameworks.",
              "Performance Optimization – Writing efficient, high-performance code for fast-loading applications.",
              "API Development & Integration – Creating RESTful and GraphQL APIs, integrating third-party services.",
              "DevOps & CI/CD – Automating deployments, managing Docker containers, and setting up scalable infrastructures.",
              "Headless CMS & WordPress REST API – Developing dynamic frontend experiences using WordPress as a backend.",
              "Cloud & Server Management – Deploying applications on AWS, Vercel, and DigitalOcean with Nginx configuration.",
              "Mobile Development – Creating cross-platform mobile apps with React Native.",
              "Security & Authentication – Implementing secure authentication with NextAuth, JWT, and OAuth.",
              "Collaboration & Leadership – Leading development teams, mentoring junior developers, and managing agile projects.",
              "Open Source Contributions – Actively contributing to open-source projects and maintaining personal projects.",
            ].map((ability: string, index) => (
              <div
                key={index}
                className='flex items-center text-white bg-gray-800 p-5 rounded-lg shadow-lg'
              >
                <span className='text-lg'>{ability}</span>
              </div>
            ))}
          </div>
        </section>

        <section className='space-y-10 '>
          <h4 className='text-3xl font-sans font-semibold text-gray-500'>
            Let&apos;s work together
          </h4>
          <HireMeForm />
        </section>

        <section className='w-full flex items-center text-center py-10 text-base font-marlish text-slate-100 justify-center'>
          <span>Built with ❤️ by Short Dev</span>
        </section>
      </main>
    </div>
  );
}

export type ProductCardProps = {
  title: string;
  img: string;
  url: string;
  type: "contract" | "personal" | "opensource";
  description?: string;
  techStack?: string[];
  status?: "completed" | "maintenance" | "ongoing";
};

const ProjectCard: React.FC<ProductCardProps> = ({
  title,
  img,
  url,
  type,
  description,
  techStack,
  status,
}) => {
  return (
    <Card
      className={cn(
        "bg-gray-800 text-white border-none shadow-sm rounded-lg overflow-hidden"
      )}
    >
      <Link
        href={url}
        aria-label={`View project ${title}`}
        className='block'
      >
        <Image
          src={img}
          alt={`Preview of ${title}`}
          width={400}
          height={250}
          className='w-full h-auto object-cover'
          priority
        />
      </Link>

      <div className='p-4 flex flex-col gap-3'>
        <Link
          href={url}
          aria-label={`View project ${title}`}
        >
          <h2 className='text-lg md:text-xl font-medium font-marlish'>
            {title}
          </h2>
        </Link>

        {description && (
          <p className='text-sm font-marlish md:text-base text-gray-300 leading-relaxed'>
            {description}
          </p>
        )}

        <div className='flex flex-wrap font-marlish gap-2 text-xs md:text-sm font-semibold'>
          <span className='px-3 text-sm py-1 bg-gray-600 rounded-lg'>
            {type}
          </span>
          {status && (
            <span
              className={cn(
                "px-3 py-1 rounded-lg",
                status === "completed" && "bg-green-500",
                status === "maintenance" && "bg-yellow-500",
                status === "ongoing" && "bg-blue-500"
              )}
            >
              {status}
            </span>
          )}
        </div>

        {techStack && techStack.length > 0 && (
          <div className='flex font-marlish flex-wrap gap-2 mt-2'>
            {techStack.map((stack) => (
              <span
                key={stack}
                className='px-3 py-1 bg-gray-700 text-xs text-gray-300 rounded-lg'
              >
                {stack}
              </span>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
