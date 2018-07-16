const expect = require('expect.js');
const vscode = require('vscode');
const KiteRouter = require('../src/router');
const {fixtureURI, withRoutes, withKiteWhitelistedPaths, fakeResponse, log} = require('./helpers');
const {asArray} = require('../src/html-utils');

const {
  hasMembersSection, hasDocsSection, hasHeaderSection, hasExamplesSection,
  hasArgumentsSection, hasUsagesSection,
} = require('./section-helpers');

describe('router', () => {
  before(function () {
    this.jsdom = require('jsdom-global')()
  })
  
  after(function () {
    this.jsdom()
  })

  let router;

  withKiteWhitelistedPaths([__dirname], () => {
    beforeEach(() => {
      router = new KiteRouter();
    })

    describe('member route', () => {
      describe('for a module', () => {
        const source = require(fixtureURI('module-os.json'));
        
        withRoutes([
          [
            o => /\/api\/editor\/symbol\//.test(o.path),
            o => fakeResponse(200, JSON.stringify(source))
          ]
        ])
  
        beforeEach(() => {
          router.registerNavigationStep(vscode.Uri.parse('kite-vscode-sidebar://member/python;foo'));
          
          return router.provideTextDocumentContent().then(html => document.body.innerHTML = html);
        });
  
        hasHeaderSection('os module');
  
        hasMembersSection(5, source.symbol.value[0].id);
        
        hasDocsSection(source.report.description_html);
        
        hasExamplesSection(2, source.symbol.id, source.report.examples);
      });

      describe('for a type', () => {
        const source = require(fixtureURI('s3connection.json'));
        
        withRoutes([
          [
            o => /\/api\/editor\/symbol\//.test(o.path),
            o => fakeResponse(200, JSON.stringify(source))
          ]
        ])
        
        beforeEach(() => {
          router.registerNavigationStep(vscode.Uri.parse('kite-vscode-sidebar://member/python;foo'));
          
          return router.provideTextDocumentContent()
          .then(html => document.body.innerHTML = html);
        });
        
        hasHeaderSection('boto.s3.connection.S3Connection(aws_access_key_id=None, aws_secret_access_key=None, is_secure=bool, port=None, proxy=None, proxy_port=None, proxy_user=None, proxy_pass=None, host=__builtin__, debug=int, https_connection_factory=None, calling_format=str, path=str, provider=str, bucket_class=__builtin__, security_token=None, suppress_consec_slashes=bool, anon=bool, validate_certs=None, profile_name=None) type');
        
        hasArgumentsSection(source.symbol.value[0].details.type.language_details.python.constructor, source.language);

        hasMembersSection(5, source.symbol.value[0].id);
        
        hasDocsSection(source.report.description_html);
      });
      
      describe('for a function', () => {
        const source = require(fixtureURI('dumps.json'));
        
        withRoutes([
          [
            o => /\/api\/editor\/symbol\//.test(o.path),
            o => fakeResponse(200, JSON.stringify(source))
          ]
        ])
        
        beforeEach(() => {
          router.registerNavigationStep(vscode.Uri.parse('kite-vscode-sidebar://member/python;foo'));
          
          return router.provideTextDocumentContent()
          .then(html => document.body.innerHTML = html);
        });
        
        hasHeaderSection('json.dumps(obj, skipkeys=bool, ensure_ascii=bool, check_circular=bool, allow_nan=bool, cls=None, indent=None, separators=None, encoding=str, default=None, sort_keys=bool, **kw) function');
        
        hasArgumentsSection(source.symbol.value[0].details.function, source.language);
        
        hasDocsSection(source.report.description_html);
        
        hasUsagesSection(source.report.usages);
  
        hasExamplesSection(2, source.symbol.id, source.report.examples);
      });

      describe('for an instance', () => {
        const source = require(fixtureURI('test-instance.json'));
        
        withRoutes([
          [
            o => /\/api\/editor\/symbol\//.test(o.path),
            o => fakeResponse(200, JSON.stringify(source))
          ]
        ])
        
        beforeEach(() => {
          router.registerNavigationStep(vscode.Uri.parse('kite-vscode-sidebar://member/python;foo'));
          
          return router.provideTextDocumentContent()
          .then(html => document.body.innerHTML = html);
        });
        
        hasHeaderSection('test B');
        
        hasDocsSection(source.report.description_html);
        
        hasUsagesSection(source.report.usages);
      });
    });

    describe('link route', () => {
      describe('for a module', () => {
        const source = require(fixtureURI('module-os.json'));
        
        withRoutes([
          [
            o => /\/api\/editor\/symbol\//.test(o.path),
            o => fakeResponse(200, JSON.stringify(source))
          ]
        ])
  
        beforeEach(() => {
          router.registerNavigationStep(vscode.Uri.parse('kite-vscode-sidebar://link/python;foo'));
          
          return router.provideTextDocumentContent().then(html => document.body.innerHTML = html);
        });
  
        hasHeaderSection('os module');
  
        hasMembersSection(5, source.symbol.value[0].id);
        
        hasDocsSection(source.report.description_html);
        
        hasExamplesSection(2, source.symbol.id, source.report.examples);
      });

      describe('for a type', () => {
        const source = require(fixtureURI('s3connection.json'));
        
        withRoutes([
          [
            o => /\/api\/editor\/symbol\//.test(o.path),
            o => fakeResponse(200, JSON.stringify(source))
          ]
        ])
        
        beforeEach(() => {
          router.registerNavigationStep(vscode.Uri.parse('kite-vscode-sidebar://link/python;foo'));
          
          return router.provideTextDocumentContent()
          .then(html => document.body.innerHTML = html);
        });
        
        hasHeaderSection('boto.s3.connection.S3Connection(aws_access_key_id=None, aws_secret_access_key=None, is_secure=bool, port=None, proxy=None, proxy_port=None, proxy_user=None, proxy_pass=None, host=__builtin__, debug=int, https_connection_factory=None, calling_format=str, path=str, provider=str, bucket_class=__builtin__, security_token=None, suppress_consec_slashes=bool, anon=bool, validate_certs=None, profile_name=None) type');
        
        hasArgumentsSection(source.symbol.value[0].details.type.language_details.python.constructor, source.language);

        hasMembersSection(5, source.symbol.value[0].id);
        
        hasDocsSection(source.report.description_html);
      });
      
      describe('for a function', () => {
        const source = require(fixtureURI('dumps.json'));
        
        withRoutes([
          [
            o => /\/api\/editor\/symbol\//.test(o.path),
            o => fakeResponse(200, JSON.stringify(source))
          ]
        ])
        
        beforeEach(() => {
          router.registerNavigationStep(vscode.Uri.parse('kite-vscode-sidebar://link/python;foo'));
          
          return router.provideTextDocumentContent()
          .then(html => document.body.innerHTML = html);
        });
        
        hasHeaderSection('json.dumps(obj, skipkeys=bool, ensure_ascii=bool, check_circular=bool, allow_nan=bool, cls=None, indent=None, separators=None, encoding=str, default=None, sort_keys=bool, **kw) function');
        
        hasArgumentsSection(source.symbol.value[0].details.function, source.language);
        
        hasDocsSection(source.report.description_html);
        
        hasUsagesSection(source.report.usages);
  
        hasExamplesSection(2, source.symbol.id, source.report.examples);
      });

      describe('for an instance', () => {
        const source = require(fixtureURI('test-instance.json'));
        
        withRoutes([
          [
            o => /\/api\/editor\/symbol\//.test(o.path),
            o => fakeResponse(200, JSON.stringify(source))
          ]
        ])
        
        beforeEach(() => {
          router.registerNavigationStep(vscode.Uri.parse('kite-vscode-sidebar://link/python;foo'));
          
          return router.provideTextDocumentContent()
          .then(html => document.body.innerHTML = html);
        });
        
        hasHeaderSection('test B');
        
        hasDocsSection(source.report.description_html);
        
        hasUsagesSection(source.report.usages);
      });
    });

    describe('value route', () => {
      describe('for a module', () => {
        const source = require(fixtureURI('module-os.json'));
        
        withRoutes([
          [
            o => /\/api\/editor\/symbol\//.test(o.path),
            o => fakeResponse(200, JSON.stringify(source))
          ]
        ])
  
        beforeEach(() => {
          router.registerNavigationStep(vscode.Uri.parse('kite-vscode-sidebar://value/python;foo'));
          
          return router.provideTextDocumentContent().then(html => document.body.innerHTML = html);
        });
  
        hasHeaderSection('os module');
  
        hasMembersSection(5, source.symbol.value[0].id);
        
        hasDocsSection(source.report.description_html);
        
        hasExamplesSection(2, source.symbol.id, source.report.examples);
      });

      describe('for a type', () => {
        const source = require(fixtureURI('s3connection.json'));
        
        withRoutes([
          [
            o => /\/api\/editor\/symbol\//.test(o.path),
            o => fakeResponse(200, JSON.stringify(source))
          ]
        ])
        
        beforeEach(() => {
          router.registerNavigationStep(vscode.Uri.parse('kite-vscode-sidebar://value/python;foo'));
          
          return router.provideTextDocumentContent()
          .then(html => document.body.innerHTML = html);
        });
        
        hasHeaderSection('boto.s3.connection.S3Connection(aws_access_key_id=None, aws_secret_access_key=None, is_secure=bool, port=None, proxy=None, proxy_port=None, proxy_user=None, proxy_pass=None, host=__builtin__, debug=int, https_connection_factory=None, calling_format=str, path=str, provider=str, bucket_class=__builtin__, security_token=None, suppress_consec_slashes=bool, anon=bool, validate_certs=None, profile_name=None) type');
        
        hasArgumentsSection(source.symbol.value[0].details.type.language_details.python.constructor, source.language);

        hasMembersSection(5, source.symbol.value[0].id);
        
        hasDocsSection(source.report.description_html);
      });
      
      describe('for a function', () => {
        const source = require(fixtureURI('dumps.json'));
        
        withRoutes([
          [
            o => /\/api\/editor\/symbol\//.test(o.path),
            o => fakeResponse(200, JSON.stringify(source))
          ]
        ])
        
        beforeEach(() => {
          router.registerNavigationStep(vscode.Uri.parse('kite-vscode-sidebar://value/python;foo'));
          
          return router.provideTextDocumentContent()
          .then(html => document.body.innerHTML = html);
        });
        
        hasHeaderSection('json.dumps(obj, skipkeys=bool, ensure_ascii=bool, check_circular=bool, allow_nan=bool, cls=None, indent=None, separators=None, encoding=str, default=None, sort_keys=bool, **kw) function');
        
        hasArgumentsSection(source.symbol.value[0].details.function, source.language);
        
        hasDocsSection(source.report.description_html);
        
        hasUsagesSection(source.report.usages);
  
        hasExamplesSection(2, source.symbol.id, source.report.examples);
      });

      describe('for an instance', () => {
        const source = require(fixtureURI('test-instance.json'));
        
        withRoutes([
          [
            o => /\/api\/editor\/symbol\//.test(o.path),
            o => fakeResponse(200, JSON.stringify(source))
          ]
        ])
        
        beforeEach(() => {
          router.registerNavigationStep(vscode.Uri.parse('kite-vscode-sidebar://value/python;foo'));
          
          return router.provideTextDocumentContent()
          .then(html => document.body.innerHTML = html);
        });
        
        hasHeaderSection('test B');
        
        hasDocsSection(source.report.description_html);
        
        hasUsagesSection(source.report.usages);
      });
    });

    describe('value-range route', () => {
      describe('for a function', () => {
        const source = require(fixtureURI('dumps-hover.json'));
        
        withRoutes([
          [
            o => /\/api\/buffer\/vscode\//.test(o.path),
            o => fakeResponse(200, JSON.stringify(source))
          ]
        ])
        
        beforeEach(() => {
          const uri = vscode.Uri.file(fixtureURI('sample.py'));
          
          return vscode.workspace.openTextDocument(uri).then(doc => {
            Object.defineProperty(vscode.window, 'activeTextEditor', {
              get: () => ({document: doc}),
              configurable: true,
            });
          });
        });

        beforeEach(() => {
          router.registerNavigationStep(vscode.Uri.parse('kite-vscode-sidebar://value-range/[{"line":5,"character":20}, {"line":5,"character":26}]'));
          
          return router.provideTextDocumentContent()
          .then(html => {
            return html;
          })
          .then(html => document.body.innerHTML = html);
        });
        
        hasHeaderSection('json.dumps(obj, skipkeys=bool, ensure_ascii=bool, check_circular=bool, allow_nan=bool, cls=None, indent=None, separators=None, encoding=str, default=None, sort_keys=bool, **kw) function');
        
        hasArgumentsSection(source.symbol[0].value[0].details.function, source.language);
        
        hasDocsSection(source.report.description_html);
        
        hasUsagesSection(source.report.usages);
  
        hasExamplesSection(2, source.symbol[0].id, source.report.examples);
      });
    });

    describe('members-list route', () => {
      const source = require(fixtureURI('module-os-members.json'));
      
      withRoutes([
        [
          o => /\/api\/editor\/value\//.test(o.path),
          o => fakeResponse(200, JSON.stringify(source))
        ]
      ]);

      beforeEach(() => {
        router.registerNavigationStep(vscode.Uri.parse('kite-vscode-sidebar://members-list/python;foo'));
        
        return router.provideTextDocumentContent()
        .then(html => document.body.innerHTML = html);
      });

      it('renders as many members as there is in the list', () => {
        const lis = document.querySelectorAll('li');
        expect(lis.length).to.eql(source.members.length);

        asArray(lis).forEach((li, i) => {
          const a = li.querySelector('a');

          expect(a.href).to.eql(`command:kite.navigate?%22member/${source.members[i].id}%22`);
          expect(li.querySelector('.type').textContent).to.eql(source.members[i].value[0].kind);

          if (source.members[i].value[0].synopsis) {
            expect(li.querySelector('p').textContent).to.eql(source.members[i].value[0].synopsis);
          }

          if (source.members[i].value[0].kind === 'function') {
            expect(a.textContent).to.eql(`${source.members[i].name}()`);
          } else {
            expect(a.textContent).to.eql(source.members[i].name);
          }
        })
      });
    });

    describe('examples-list route', () => {
      const source = require(fixtureURI('module-os-value.json'));
      
      withRoutes([
        [
          o => /\/api\/editor\/value\//.test(o.path),
          o => fakeResponse(200, JSON.stringify(source))
        ]
      ]);

      beforeEach(() => {
        router.registerNavigationStep(vscode.Uri.parse('kite-vscode-sidebar://examples-list/python;foo'));
        
        return router.provideTextDocumentContent()
        .then(html => document.body.innerHTML = html);
      });

      it('renders as many examples as there is in the list', () => {
        const lis = document.querySelectorAll('li');
        expect(lis.length).to.eql(source.report.examples.length);

        asArray(lis).forEach((li, i) => {
          const a = li.querySelector('a');

          expect(a.href).to.eql(`command:kite.navigate?%22example/${source.report.examples[i].id}%22`);
          expect(a.textContent.trim()).to.eql(source.report.examples[i].title);
        })
      });
    });

    describe('links-list route', () => {
      const source = require(fixtureURI('module-os-value.json'));
      
      withRoutes([
        [
          o => /\/api\/editor\/value\//.test(o.path),
          o => fakeResponse(200, JSON.stringify(source))
        ]
      ]);

      beforeEach(() => {
        router.registerNavigationStep(vscode.Uri.parse('kite-vscode-sidebar://links-list/python;foo'));
        
        return router.provideTextDocumentContent()
        .then(html => document.body.innerHTML = html);
      });

      it('renders as many examples as there is in the list', () => {
        const lis = document.querySelectorAll('li');
        expect(lis.length).to.eql(source.report.links.length);

        asArray(lis).forEach((li, i) => {
          const a = li.querySelector('a');

          expect(a.href).to.eql(source.report.links[i].url);
          expect(a.textContent.trim()).to.eql(source.report.links[i].title);
        })
      });
    });
  });
});