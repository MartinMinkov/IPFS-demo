import Head from "next/head";
import axios from "axios";

export default function Home({ archives }) {
  console.log(archives);
  return (
    <div>
      <Head>
        <title>Mina Archives Provided By IPFS</title>
        <meta name="description" content="Mina Archives Provided By IPFS" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex flex-col justify-center items-center pt-32 space-y-12 ">
        <h1 className="text-5xl">Download a Mina Archive through IPFS</h1>
        {archives.map((archive) => {
          return (
            <div
              key={archive.id}
              className="cursor-pointer flex flex-col space-y-4 bg-light-black bg-opacity-25 hover:bg-opacity-20 px-20 py-16 rounded-md"
            >
              <p>
                <span className="font-bold">CID: </span>
                {archive.cid}
              </p>
              <p>
                <span className="font-bold">Origin: </span>
                {archive.origin}
              </p>
              <p>
                <span className="font-bold">Timestamp: </span>
                {archive.timestamp}
              </p>
              <a
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-52 flex justify-center items-center"
                href={`https://ipfs.io/ipfs/${archive.cid}?filename=mina_backup_${archive.cid}.sql.tar.gz`}
              >
                Click to download
              </a>
            </div>
          );
        })}
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  const res = await axios.get("http://localhost:3001/api/archives");
  const archives = res.data;
  return {
    props: {
      archives,
    },
  };
}
