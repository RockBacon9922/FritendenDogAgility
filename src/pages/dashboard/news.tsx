import { api } from "../../utils/api";

const News: React.FC = () => {
  const { data: news, status: st } = api.news.getNews.useQuery();

  if (st === "loading") {
    return <div>Loading...</div>;
  }
  return (
    <div className="card text-slate-600">
      <h2 className="text-center text-xl font-extrabold tracking-tight ">
        The News
      </h2>
      {news?.map((newsItem) => (
        <div className="rounded-lg" key={newsItem.title}>
          <h3 className=" text-lg font-bold">{newsItem.title}</h3>
          <p className="text-sm">{newsItem.content}</p>
          {/* add the date in the right corner small */}
          <p className="relative bottom-0 right-3 text-right text-xs">
            {newsItem.createdAt.toDateString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default News;
