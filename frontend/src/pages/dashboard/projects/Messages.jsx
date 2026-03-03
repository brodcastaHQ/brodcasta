import { FileText, Filter } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loading from '../../../components/ui/Loading';
import { createClient } from '../../../utils/client';

const ProjectMessages = () => {
  const { projectId } = useParams();
  const [messages, setMessages] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 50,
    offset: 0,
    has_more: false
  });

  const fetchMessages = async (offset = 0) => {
    try {
      const client = createClient('/api/messages');
      const params = new URLSearchParams({
        limit: pagination.limit.toString(),
        offset: offset.toString(),
        ...(selectedRoom && { room_id: selectedRoom }),
        ...(selectedType && { message_type: selectedType })
      });
      
      const response = await client.get(`/project/${projectId}?${params}`);
      setMessages(response.data.messages);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error(err);
      setError('Failed to load messages.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      const client = createClient('/api/messages');
      const response = await client.get(`/project/${projectId}/rooms`);
      setRooms(response.data.rooms);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLoadMore = () => {
    const newOffset = pagination.offset + pagination.limit;
    fetchMessages(newOffset);
  };

  const handleDeleteMessages = async () => {
    if (!confirm('Are you sure you want to delete all messages? This action cannot be undone.')) {
      return;
    }

    try {
      const client = createClient('/api/messages');
      const params = new URLSearchParams(
        selectedRoom ? { room_id: selectedRoom } : {}
      );
      
      await client.delete(`/project/${projectId}?${params}`);
      setMessages([]);
      setPagination(prev => ({ ...prev, total: 0, has_more: false }));
    } catch (err) {
      console.error(err);
      setError('Failed to delete messages.');
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchRooms();
  }, [projectId, selectedRoom, selectedType]);

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dot Pattern Background */}
      <div className="absolute inset-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="dotGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8"/>
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.2"/>
            </radialGradient>
          </defs>
          
          {/* Dot grid pattern */}
          <circle cx="50" cy="50" r="10" fill="url(#dotGradient)" />
          <circle cx="150" cy="50" r="10" fill="url(#dotGradient)" />
          <circle cx="250" cy="50" r="10" fill="url(#dotGradient)" />
          <circle cx="350" cy="50" r="10" fill="url(#dotGradient)" />
          <circle cx="450" cy="50" r="10" fill="url(#dotGradient)" />
          <circle cx="550" cy="50" r="10" fill="url(#dotGradient)" />
          <circle cx="650" cy="50" r="10" fill="url(#dotGradient)" />
          <circle cx="750" cy="50" r="10" fill="url(#dotGradient)" />
          
          <circle cx="50" cy="200" r="6" fill="url(#dotGradient)" />
          <circle cx="150" cy="200" r="6" fill="url(#dotGradient)" />
          <circle cx="250" cy="200" r="6" fill="url(#dotGradient)" />
          <circle cx="350" cy="200" r="6" fill="url(#dotGradient)" />
          <circle cx="450" cy="200" r="6" fill="url(#dotGradient)" />
          <circle cx="550" cy="200" r="6" fill="url(#dotGradient)" />
          <circle cx="650" cy="200" r="6" fill="url(#dotGradient)" />
          <circle cx="750" cy="200" r="6" fill="url(#dotGradient)" />
          
          <circle cx="50" cy="400" r="3" fill="url(#dotGradient)" />
          <circle cx="150" cy="400" r="3" fill="url(#dotGradient)" />
          <circle cx="250" cy="400" r="3" fill="url(#dotGradient)" />
          <circle cx="350" cy="400" r="3" fill="url(#dotGradient)" />
          <circle cx="450" cy="400" r="3" fill="url(#dotGradient)" />
          <circle cx="550" cy="400" r="3" fill="url(#dotGradient)" />
          <circle cx="650" cy="400" r="3" fill="url(#dotGradient)" />
          <circle cx="750" cy="400" r="3" fill="url(#dotGradient)" />
        </svg>
      </div>
      
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-base-200/80"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-base-100 border-b border-base-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-8">
              <div>
                <h1 className="text-3xl font-bold text-base-content">Messages</h1>
                <p className="text-base-content/60 mt-1">View and manage your project messages</p>
              </div>
              <button
                onClick={handleDeleteMessages}
                className="inline-flex items-center px-4 py-2 border border-error/30 rounded-lg text-sm font-medium text-error bg-error/10 hover:bg-error/20 transition-colors"
              >
                Delete All Messages
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="mb-6 bg-error/10 border border-error/20 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Activity className="h-5 w-5 text-error" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-error">Error</h3>
                  <div className="mt-2 text-sm text-error/80">{error}</div>
                </div>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="bg-base-100 rounded-xl border border-base-300 p-6 mb-8">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-base-content/60" />
                <span className="text-sm font-medium text-base-content">Filters:</span>
              </div>
              
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className="px-3 py-2 border border-base-300 rounded-lg text-sm bg-base-100 text-base-content focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">All Rooms</option>
                {rooms.map(room => (
                  <option key={room} value={room}>{room}</option>
                ))}
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-base-300 rounded-lg text-sm bg-base-100 text-base-content focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">All Types</option>
                <option value="room_message">Room Messages</option>
                <option value="broadcast_message">Broadcast Messages</option>
                <option value="direct_message">Direct Messages</option>
              </select>
            </div>
          </div>

          {/* Messages List */}
          <div className="bg-base-100 rounded-xl border border-base-300 overflow-hidden">
            <div className="px-6 py-4 border-b border-base-300 bg-base-100">
              <h2 className="text-lg font-semibold text-base-content">
                Messages ({pagination.total} total)
              </h2>
            </div>
            
            <div className="divide-y divide-base-300 max-h-96 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-base-content/30 mb-4" />
                  <h3 className="text-lg font-semibold text-base-content mb-2">No messages found</h3>
                  <p className="text-base-content/60">
                    {selectedRoom || selectedType 
                      ? 'Try adjusting your filters to see more messages.' 
                      : 'Start sending messages to see them appear here.'}
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className="p-4 hover:bg-base-200 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {message.message_type?.replace('_', ' ') || 'Unknown'}
                          </span>
                          <span className="text-xs text-base-content/60">
                            {message.room_id}
                          </span>
                          <span className="text-xs text-base-content/40">
                            {new Date(message.created_at).toLocaleString()}
                          </span>
                        </div>
                        <div className="text-sm text-base-content">
                          {typeof message.data === 'string' 
                            ? message.data 
                            : JSON.stringify(message.data)}
                        </div>
                        {message.sender_id && (
                          <div className="text-xs text-base-content/40 mt-1">
                            From: {message.sender_id}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Load More */}
            {pagination.has_more && (
              <div className="p-4 border-t border-base-300">
                <button
                  onClick={handleLoadMore}
                  className="w-full px-4 py-2 border border-base-300 rounded-lg text-sm font-medium text-base-content bg-base-100 hover:bg-base-200 transition-colors"
                >
                  Load More Messages
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectMessages;
