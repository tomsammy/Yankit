import React, { useState, useEffect, useRef } from 'react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { MessageSquare, X, Send, Menu } from 'lucide-react';
    import { useNavigate } from 'react-router-dom';
    import { getInitialGreeting, getResponse, getOptions } from './chatbotLogic';

    const Chatbot = () => {
      const [isOpen, setIsOpen] = useState(false);
      const [messages, setMessages] = useState([]);
      const [inputValue, setInputValue] = useState('');
      const [currentFlow, setCurrentFlow] = useState('initial');
      const [currentOptions, setCurrentOptions] = useState([]);
      const navigate = useNavigate();
      const messagesEndRef = useRef(null);

      useEffect(() => {
        const greeting = getInitialGreeting();
        setMessages([greeting]);
        setCurrentOptions(getOptions('initial'));
      }, []);

      useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, [messages]);

      const addUserMessage = (text) => {
        const newUserMessage = { id: Date.now().toString() + '_user', text, sender: 'user' };
        setMessages(prev => [...prev, newUserMessage]);
        return newUserMessage;
      };

      const addBotMessage = (text, delay = 500) => {
        setTimeout(() => {
          const newBotMessage = { id: Date.now().toString() + '_bot', text, sender: 'bot' };
          setMessages(prev => [...prev, newBotMessage]);
        }, delay);
      };

      const processUserInput = (userInput) => {
        const response = getResponse(currentFlow, userInput);
        
        addBotMessage(response.text);
        setCurrentFlow(response.nextFlow);
        setCurrentOptions(response.options || getOptions(response.nextFlow));

        if (response.action === 'navigate' && response.path) {
          navigate(response.path);
          setIsOpen(false); 
        }
      };

      const handleOptionClick = (optionId) => {
        const selectedOption = currentOptions.find(opt => opt.id === optionId);
        if (!selectedOption) return;

        addUserMessage(selectedOption.text.replace(/<[^>]*>?/gm, '')); 
        setCurrentOptions([]); 

        processUserInput(optionId);
      };

      const handleInputChange = (e) => {
        setInputValue(e.target.value);
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;
        
        const text = inputValue.trim();
        addUserMessage(text);
        setInputValue('');
        setCurrentOptions([]);

        processUserInput(text.toLowerCase()); 
      };

      const toggleChat = () => setIsOpen(!isOpen);
      
      const handleMainMenu = () => {
        const response = getResponse(currentFlow, 'main_menu');
        addBotMessage("Okay, what can I help you with?");
        setCurrentFlow(response.nextFlow);
        setCurrentOptions(response.options || getOptions(response.nextFlow));
      };


      return (
        <>
          <motion.div
            className="fixed bottom-20 right-6 z-50"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              onClick={toggleChat}
              size="lg"
              className="rounded-full p-4 h-16 w-16 bg-gradient-to-tr from-primary to-purple-600 text-white shadow-xl hover:scale-110 transition-transform"
              aria-label="Toggle Chatbot"
            >
              {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
            </Button>
          </motion.div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed bottom-[calc(5rem+1.5rem)] right-6 w-full max-w-sm h-[70vh] max-h-[600px] bg-white dark:bg-slate-800 rounded-xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-700 z-50"
              >
                <header className="p-4 bg-gradient-to-r from-primary to-purple-600 text-white flex items-center justify-between">
                  <h3 className="font-semibold text-lg"><span className="font-vernaccia-bold">Yankit</span> Assistant</h3>
                  <Button variant="ghost" size="icon" onClick={toggleChat} className="text-white hover:bg-white/20">
                    <X size={20} />
                  </Button>
                </header>

                <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-slate-50 dark:bg-slate-900/50">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, x: msg.sender === 'bot' ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex ${msg.sender === 'bot' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`p-3 rounded-xl max-w-[80%] text-sm shadow-md ${
                          msg.sender === 'bot'
                            ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-none'
                            : 'bg-primary text-primary-foreground rounded-br-none'
                        }`}
                        dangerouslySetInnerHTML={{ __html: msg.text }}
                      />
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                
                {currentOptions && currentOptions.length > 0 && (
                  <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {currentOptions.map((option) => (
                        <Button
                          key={option.id}
                          variant="outline"
                          onClick={() => handleOptionClick(option.id)}
                          className="w-full justify-start text-left h-auto py-2 dark:border-slate-600 dark:hover:bg-slate-700"
                        >
                          {option.icon && <option.icon size={18} className="mr-2 shrink-0" />}
                          <span className="whitespace-normal leading-tight text-xs sm:text-sm" dangerouslySetInnerHTML={{ __html: option.text }} />
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="p-3 border-t border-slate-200 dark:border-slate-700 flex items-center space-x-2 bg-white dark:bg-slate-800">
                  {currentFlow !== 'initial' && (
                     <Button type="button" variant="ghost" size="icon" onClick={handleMainMenu} aria-label="Main Menu" className="text-muted-foreground hover:text-primary">
                        <Menu size={20} />
                     </Button>
                  )}
                  <Input
                    type="text"
                    placeholder="Type your message..."
                    value={inputValue}
                    onChange={handleInputChange}
                    className="flex-grow bg-slate-100 dark:bg-slate-700 border-transparent focus:border-primary focus:ring-primary"
                  />
                  <Button type="submit" size="icon" className="bg-primary hover:bg-primary/90">
                    <Send size={18} />
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      );
    };

    export default Chatbot;