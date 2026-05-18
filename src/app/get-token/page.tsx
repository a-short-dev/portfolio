"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function GetTokenPage() {
	const [code, setCode] = useState("");
	const [refreshToken, setRefreshToken] = useState("");
	const [loading, setLoading] = useState(false);

	const REDIRECT_URI = "https://google.com";
	const CLIENT_ID = "255cf95946a841f486e2cb9d200f9efb"; // Public client ID is safe to show
	const SCOPES = "user-read-currently-playing user-read-playback-state";

	const loginUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&scope=${encodeURIComponent(SCOPES)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;

	const handleExchange = async () => {
		if (!code) return toast.error("Please enter the code first");
		setLoading(true);

		try {
			const res = await fetch("/api/exchange-token", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ code }),
			});
			const data = await res.json();

			if (data.refresh_token) {
				setRefreshToken(data.refresh_token);
				toast.success("Token generated!");
			} else {
				toast.error("Failed: " + JSON.stringify(data));
			}
		} catch (error) {
			toast.error("Error exchanging token");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 font-mono">
			<div className="max-w-2xl w-full space-y-8 bg-white/5 p-8 border border-white/10 rounded-lg">
				<h1 className="text-2xl font-bold text-accent">
					Spotify Token Generator (Manual Mode)
				</h1>

				<div className="space-y-4">
					<div className="space-y-2">
						<h3 className="text-xl font-bold">Step 1: Dashboard Config</h3>
						<p className="text-white/60 text-sm">
							Add <code>https://google.com</code> to your Redirect URIs in the
							Spotify Dashboard and click Save.
						</p>
					</div>

					<div className="space-y-2">
						<h3 className="text-xl font-bold">Step 2: Authenticate</h3>
						<a
							href={loginUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-block bg-[#1DB954] text-black px-6 py-2 font-bold rounded hover:scale-105 transition-transform"
						>
							Open Login Window
						</a>
						<p className="text-white/60 text-sm mt-2">
							You will be redirected to Google.{" "}
							<strong>Copy the 'code' parameter</strong> from the address bar
							URL.
							<br />
							Example: <code>google.com/?code=YourCodeIsHere...</code>
						</p>
					</div>

					<div className="space-y-4">
						<h3 className="text-xl font-bold">Step 3: Exchange Code</h3>
						<input
							value={code}
							onChange={(e) => setCode(e.target.value)}
							placeholder="Paste code here..."
							className="w-full bg-black border border-white/20 p-4 text-white focus:border-accent outline-none"
						/>
						<button
							onClick={handleExchange}
							disabled={loading}
							className="bg-white text-black px-6 py-2 font-bold w-full hover:bg-gray-200 disabled:opacity-50"
						>
							{loading ? "Exchanging..." : "Generate Refresh Token"}
						</button>
					</div>

					{refreshToken && (
						<div className="space-y-2 pt-4 border-t border-white/10">
							<h3 className="text-xl font-bold text-green-400">Success!</h3>
							<p className="text-sm text-white/60">
								Add this to your .env file:
							</p>
							<div className="bg-black/50 p-4 border border-green-500/30 rounded break-all select-all text-green-400">
								SPOTIFY_REFRESH_TOKEN={refreshToken}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
