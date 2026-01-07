import { useState } from 'react';
import { pb } from '../lib/pocketbase';
import { toast } from 'sonner';
import { useAppDispatch } from '../redux/hooks';
import { logout as localLogout } from '../redux/generalSlice';

export const Auth = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useAppDispatch();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (isLogin) {
                await pb.collection('users').authWithPassword(email, password);
                toast.success('Logged in successfully!');
            } else {
                await pb.collection('users').create({
                    email,
                    password,
                    passwordConfirm: password,
                });
                await pb.collection('users').authWithPassword(email, password);
                toast.success('Account created and logged in!');
            }
            window.location.reload(); // Quick way to refresh state
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        pb.authStore.clear();
        dispatch(localLogout());
        window.location.reload();
    };

    if (pb.authStore.isValid) {
        return (
            <div className="flex flex-col gap-2 p-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-xs text-neutral-400">Logged in as:</p>
                <p className="text-sm font-bold text-gold truncate">{pb.authStore.model?.email}</p>
                <button 
                    onClick={logout}
                    className="mt-2 text-xs bg-red-500/20 text-red-400 py-2 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                    Logout
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 p-6 bg-neutral-800/80 rounded-[2rem] border border-white/10 shadow-xl">
            <h3 className="text-xl font-black text-center text-white tracking-tight">
                {isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}
            </h3>
            
            <form onSubmit={handleAuth} className="flex flex-col gap-3">
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-gold/50 transition-colors"
                    required
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-gold/50 transition-colors"
                    required
                />
                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="bg-gold text-black font-black py-3 rounded-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                >
                    {isLoading ? 'Processing...' : (isLogin ? 'LOGIN' : 'SIGN UP')}
                </button>
            </form>

            <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-xs text-neutral-400 hover:text-white transition-colors"
            >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
            </button>
        </div>
    );
};
