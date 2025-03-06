define(['managerAPI',
		'https://cdn.jsdelivr.net/gh/minnojs/minno-datapipe@1.*/datapipe.min.js'], function(Manager){


	//You can use the commented-out code to get parameters from the URL.
	//const queryString = window.location.search;
    //const urlParams = new URLSearchParams(queryString);
    //const pt = urlParams.get('pt');

	var API    = new Manager();
	//const subid = Date.now().toString(16)+Math.floor(Math.random()*10000).toString(16);
	init_data_pipe(API, 'QDDGHx7qdUtn', {file_type:'csv'});	

    API.setName('mgr');
    API.addSettings('skip',true);

    API.addTasksSet({
        instructions: [{
            type: 'message',
            buttonText: 'Continue'
        }],

        consent: [{
		type: 'quest', 
		name: 'consent', 
		scriptUrl: 'consent.js', 
		header: 'Consent', 
		title: 'Consent Agreement', 
		buttonText: 'Invia' }],	    

        intro: [{
            inherit: 'instructions',
            name: 'intro',
            templateUrl: 'intro.jst',
            title: 'Intro',
            header: 'Welcome'
        }],

        biat_instructions: [{
            inherit: 'instructions',
            name: 'biat_instructions',
            templateUrl: 'biat_instructions.jst',
            title: 'Istruzioni',
            buttonText: 'Continua',
            piTemplate: true
        }],
	    
        practice_instructions: [{
            inherit: 'instructions',
            name: 'practice_instructions',
            templateUrl: 'practice_instructions.jst',
            title: 'Istruzioni',
            buttonText: 'Continua',
            piTemplate: true
        }],
	    
         explicit: [{
            type: 'quest',
            name: 'explicits',
            scriptUrl: 'explicits.js',
            title: 'Questionario',
            header: 'Questionario'
        }],

        raceiat: [{
            type: 'time',
            name: 'raceiat',
            scriptUrl: 'raceiat.js'
        }],
	    
	practice: [{
            type: 'time',
            name: 'practice',
            scriptUrl: 'practice.js'
        }],
	    
	biat: [{
            type: 'time',
            name: 'biat',
            scriptUrl: 'BIAT.js'
        }],

        questdemo: [{
            type: 'quest',
            name: 'questdemo',
            scriptUrl: 'questdemo.js',
            title: 'Questionario',
            header: 'Questionario'
        }],
	    
        debriefing: [{
            type: 'quest',
            name: 'lastpage',
            scriptUrl: 'debriefing.js',
            last: true
        }],	    

        lastpage: [{
            type: 'message',
            name: 'lastpage',
            templateUrl: 'debriefing.jst',
            title: 'End',
            //Uncomment the following if you want to end the study here.
            //last:true, 
            header: 'You have completed the study'
        }], 
        
        //Use if you want to redirect the participants elsewhere at the end of the study
        redirect:
        [{ 
			//Replace with any URL you need to put at the end of your study, or just remove this task from the sequence below
            type:'redirect', name:'redirecting', url: 'https://www.google.com/search' 
        }],
		
		//This task waits until the data are sent to the server.
        uploading: uploading_task({header: 'just a moment', body:'Please wait, sending data... '})
    });

    API.addSequence([
        { type: 'isTouch' }, //Use Minno's internal touch detection mechanism. 
        
        { type: 'post', path: ['$isTouch', 'raceSet', 'blackLabels', 'whiteLabels'] },

        // apply touch only styles
        {
            mixer:'branch',
            conditions: {compare:'global.$isTouch', to: true},
            data: [
                {
                    type: 'injectStyle',
                    css: [
                        '* {color:red}',
                        '[piq-page] {background-color: #fff; border: 1px solid transparent; border-radius: 4px; box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05); margin-bottom: 20px; border-color: #bce8f1;}',
                        '[piq-page] > ol {margin: 15px;}',
                        '[piq-page] > .btn-group {margin: 0px 15px 15px 15px;}',
                        '.container {padding:5px;}',
                        '[pi-quest]::before, [pi-quest]::after {content: " ";display: table;}',
                        '[pi-quest]::after {clear: both;}',
                        '[pi-quest] h3 { border-bottom: 1px solid transparent; border-top-left-radius: 3px; border-top-right-radius: 3px; padding: 10px 15px; color: inherit; font-size: 2em; margin-bottom: 20px; margin-top: 0;background-color: #d9edf7;border-color: #bce8f1;color: #31708f;}',
                        '[pi-quest] .form-group > label {font-size:1.2em; font-weight:normal;}',

                        '[pi-quest] .btn-toolbar {margin:15px;float:none !important; text-align:center;position:relative;}',
                        '[pi-quest] [ng-click="decline($event)"] {position:absolute;right:0;bottom:0}',
                        '[pi-quest] [ng-click="submit()"] {width:30%;line-height: 1.3333333;border-radius: 6px;}',
                        // larger screens
                        '@media (min-width: 480px) {',
                        ' [pi-quest] [ng-click="submit()"] {width:30%;padding: 10px 16px;font-size: 1.6em;}',
                        '}',
                        // phones and smaller screens
                        '@media (max-width: 480px) {',
                        ' [pi-quest] [ng-click="submit()"] {padding: 8px 13px;font-size: 1.2em;}',
                        ' [pi-quest] [ng-click="decline($event)"] {font-size: 0.9em;padding:3px 6px;}',
                        '}'
                    ]
                }
            ]
        },
        
        
        {inherit: 'consent'},
        {
            mixer: 'branch',// if participants choose "I decline", they are taken to a transition page telling them they are being redirected
            conditions: [
                function(){ return piGlobal.consent.questions.userconsent.response === true;} // if the question name or response options were changed in consent.js, adapt this too 
            ],
            data: [
                    {
                        inherit: 'practice_instructions'
                    }
            ],
            elseData: [// if participants does not agree to participate, they are redirected.
                {
                    inherit: 'redirectpage'
                },
                {
                    inherit: 'redirect'
                }
            ]
    },
    {
        inherit: 'practice'
    },
    {
        inherit: 'biat_instructions'
    },
    {
        inherit: 'biat'
    },
    {
        inherit: 'explicits'
    },
    {
        inherit: 'questdemo'
    }, 
    {
        inherit: 'debriefing'
    },
	{inherit: 'uploading'},
        {inherit: 'lastpage'},
        {inherit: 'redirect'}
    ]);

    return API.script;
});
