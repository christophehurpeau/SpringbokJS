var child_process = require('child_process');
var sys = require("sys");

module.exports={
	process: null,
	restarting: false,
	
	"restart": function() {
		if(this.process){
			sys.debug('Server: Stopping server for restart');
			this.restarting = true;
			this.process.kill();
		}else this.start();
	},
	
	"start": function() {
		sys.debug('Server: Starting');
		var t=this;
		t.restarting=false;
		
		t.process = child_process.spawn('node',['start.js']);
		t.process.stdout.addListener('data', function (data) {
			process.stdout.write(data);
		});
		t.process.stderr.addListener('data', function (data) {
			sys.print(data);
		});
		t.process.addListener('exit', function (code) {
			sys.debug('Server: exited (status='+code+')');
			t.process = null;
			if (t.restarting)
				t.start();
		});
	},
	
	"stop": function(){
		this.restarting = false;
		this.process && this.process.kill();
	}
}
