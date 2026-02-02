import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PostList } from '../components/PostList';
import Hero from '../components/Hero';
import { getAllPublishedPosts } from '../services/post-service';
import { PostType } from '../types/post';
import UpcomingEvents from '../components/UpcomingEvents';
import Ecosystem from '../components/Ecosystem';

export default function HomePage() {
  const navigate = useNavigate();
  
  const { data: posts = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['published-posts', 'home'],
    queryFn: getAllPublishedPosts,
  });

  const featuredEvents = posts.filter(post => post.type === PostType.EVENT).slice(0, 2);

  return (
    <div className="bg-white min-h-screen bg-black text-white">
      <Hero/>
      <UpcomingEvents />
      <Ecosystem />
      {/* Latest Content Feed */}
     

      {/* Promotion Call to Action */}
      <section className="bg-blue-50 py-20">
        <div className="container mx-auto px-4">
          <div className="bg-blue-600 rounded-[3rem] p-8 md:p-16 flex flex-col md:flex-row items-center justify-between shadow-2xl shadow-blue-200">
            <div className="mb-8 md:mb-0 md:mr-8 text-center md:text-left">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">Want to promote your content?</h2>
              <p className="text-blue-100 text-lg md:text-xl max-w-xl">
                External companies can request to publish events or announcements on our platform.
              </p>
            </div>
            <button 
              onClick={() => navigate('/promotion-request')}
              className="bg-white text-blue-600 px-10 py-5 rounded-2xl text-xl font-black hover:bg-gray-100 transition shadow-xl transform active:scale-95"
            >
              Submit Request
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
