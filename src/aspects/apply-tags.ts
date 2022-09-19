import { IAspect, ITaggable, TagManager } from 'aws-cdk-lib';
import { IConstruct } from 'constructs';

type Tags = { [key: string]: string } & {
  stage: 'dev' | 'staging' | 'prod';
  project: string;
  owner: string;
}; 

export class ApplyTags implements IAspect {
  #tags: Tags;
  
  constructor(tags: Tags) {
    this.#tags = tags;
  }

  visit(node: IConstruct) {
    if (TagManager.isTaggable(node)) {
      Object.entries(this.#tags).forEach(([key, value]) => {
        console.log(`Applying tag ${key}=${value} to ${node.node.path}`);
        this.applyTag(node, key, value);
      });
    }
  }

  applyTag(resource: ITaggable, key: string, value: string) {
    resource.tags.setTag(
      key,
      value
    );
  }
}