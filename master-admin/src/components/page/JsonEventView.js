import React from 'react';

function JsonEventView(props) {
	const [view, setView] = React.useState(<div></div>);

	React.useEffect(() => {
		if (props.json != null) {
			setView(doInitializeApp());
		}
	}, [props]);

	const doInitializeApp = () => {
		let result = [];
		let rows = props.json.rows;
		for (let i=0; i<rows.length; i++) {
			let contents = [];
			for (let j=0; j<rows[i].contents.length; j++) {
				contents.push(
					<div key={j}>
						{
							rows[i].contents[j].type === "text" &&
								<div style={ rows[i].contents[j] }>{ rows[i].contents[j].text } </div>
						}
						{
							rows[i].contents[j].type === "img" &&
								<img style={ rows[i].contents[j] } src={ rows[i].contents[j].src }/>
						}
					</div>
				)
			}
			result.push(
				<div key={i} style={ rows[i] }>
					{ contents }
				</div>
			);
		}
		console.log(result);
		return result;
	}

	return view;
}

export default JsonEventView;