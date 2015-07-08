//change 2015070801
var gulp=require("gulp"),
	concat=require("gulp-concat"),
	jshint=require("gulp-jshint"),
	sass=require("gulp-ruby-sass"),
	uglify=require("gulp-uglify"),
	browserSync=require("browser-sync"),
	RevAll=require("gulp-rev-all"),
	clean=require("gulp-clean")


cdn=[
"http://res.m.yystatic.com/",
"http://res0.m.yystatic.com/",
"http://res1.m.yystatic.com/"
]

gulp.task("js",function(){
	return gulp.src("src/js/*.js")
		.pipe(jshint())
		// .pipe(concat("main.js"))
		.pipe(uglify())
		.pipe(gulp.dest("dest/js"))
})


gulp.task('sass', function() {  
	//directory
  return sass('src/sass',{style:"compressed"})
  	.on('error', function (err) {
            console.error('Error!', err.message);
    })
    .pipe(gulp.dest('dest/css'))
});

gulp.task("html",function(){
	return gulp.src("src/html/*.html")
		.pipe(gulp.dest("dest/html"))
})

gulp.task("img",function(){
	return gulp.src("src/image/*.+(jpg|png|gif)")
		.pipe(gulp.dest("dest/image"))
})



gulp.task("clean",function(){
	gulp.src("publish",{read: false})
		.pipe(clean())
})

gulp.task("browser-sync",function(){
	var files=[
	"dest/css/*.css",
	"dest/html/*.html",
	"dest/js/*.js"
	]

	browserSync.init(files,{
		server:{
			baseDir:"dest"
		}
	})
})

gulp.task("static",["img","html","sass","js"])

gulp.task("watch",function(){
	gulp.watch("src/**/*",["static"])
})

gulp.task("dev",["static","browser-sync","watch"],function(){
	console.log("开发模式已启动!")
})

gulp.task("publish",["clean"],function(){
	var _indexCopy=0
	var revAll=new RevAll({ 
		dontRenameFile: ['.html'],
		hashLength: 8,
		transformPath: function (rev, source, path) { 
			var _index=(++_indexCopy)%cdn.length
            return rev.replace('../', cdn[_index]);
        }
	})
	
	gulp.src("dest/**")
		.pipe(revAll.revision())
		.pipe(gulp.dest("publish"))
		.pipe(revAll.manifestFile())
		.pipe(gulp.dest("publish"))
	console.log("发布完成，可以上线！")
})



function test(){
	var name="gulp1"
}
