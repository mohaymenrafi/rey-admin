// import { Html, Head, Main, NextScript } from "next/document";
// import { theme } from "../themes/theme";
// import createEmotionCache from "../themes/createEmotionCache";
// import createEmotionServer from "@emotion/server/create-instance";

// export default function Document() {
// 	return (
// 		//className of roboto font add. if needed
// 		<Html lang="en">
// 			<Head>
// 				<link rel="shortcut icon" href="/favicon.ico" />
// 				<meta name="emotion-insertion-point" content="" />
// 				{/* {()} */}
// 			</Head>
// 			<body>
// 				<Main />
// 				<NextScript />
// 			</body>
// 		</Html>
// 	);
// }

// Document.getInitialProps = async (ctx) => {
// 	const originalRenderPage = ctx.renderPage;

// 	const cache = createEmotionCache();
// 	const { extractCriticalToChunks } = createEmotionServer(cache);

// 	ctx.renderPage = () => {
// 		originalRenderPage({
// 			enhanceApp: (App: any) =>
// 				function EnhanceApp(props) {
// 					return <App emotionCache={cache} {...props} />;
// 				},
// 		});

//     const initalProps = await Document.getInitialProps(ctx);

// 	};
// };

import * as React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import createEmotionServer from "@emotion/server/create-instance";
import theme, { roboto } from "../themes/theme";
import createEmotionCache from "../themes/createEmotionCache";

export default class MyDocument extends Document {
	render() {
		return (
			<Html lang="en" className={roboto.className}>
				<Head>
					{/* PWA primary color */}
					<meta name="theme-color" content={theme.palette.primary.main} />
					<link rel="shortcut icon" href="/favicon.ico" />
					<meta name="emotion-insertion-point" content="" />
					{(this.props as any).emotionStyleTags}
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with static-site generation (SSG).
MyDocument.getInitialProps = async (ctx) => {
	const originalRenderPage = ctx.renderPage;

	const cache = createEmotionCache();
	const { extractCriticalToChunks } = createEmotionServer(cache);

	ctx.renderPage = () =>
		originalRenderPage({
			enhanceApp: (App: any) =>
				function EnhanceApp(props) {
					return <App emotionCache={cache} {...props} />;
				},
		});

	const initialProps = await Document.getInitialProps(ctx);
	// This is important. It prevents Emotion to render invalid HTML.
	// See https://github.com/mui/material-ui/issues/26561#issuecomment-855286153
	const emotionStyles = extractCriticalToChunks(initialProps.html);
	const emotionStyleTags = emotionStyles.styles.map((style) => (
		<style
			data-emotion={`${style.key} ${style.ids.join(" ")}`}
			key={style.key}
			// eslint-disable-next-line react/no-danger
			dangerouslySetInnerHTML={{ __html: style.css }}
		/>
	));

	return {
		...initialProps,
		emotionStyleTags,
	};
};
