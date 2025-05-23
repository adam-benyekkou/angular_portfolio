import { Component, input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface NeuralProfileNode {
  id: string;
  title: string;
  isExpanded: boolean;
  isSelected: boolean;
  children?: NeuralProfileNode[];
  level: number;
  hasChildren: boolean;
  visible: boolean;
}

@Component({
  selector: 'app-neural-profile-tree',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './neural-profile-tree.component.html',
  styles: [],
})
export class NeuralProfileTreeComponent {
  // Input for external data (optional)
  externalData = input<NeuralProfileNode[]>([]);

  // Internal tree state
  private treeState = signal<NeuralProfileNode[]>(this.getInitialData());

  // Computed flattened tree for rendering
  treeData = computed(() => this.flattenTree(this.treeState()));

  private getInitialData(): NeuralProfileNode[] {
    return [
      {
        id: 'neuralProfile',
        title: ':TECH_CORE ',
        isExpanded: true,
        isSelected: false,
        level: 0,
        hasChildren: true,
        visible: true,
        children: [
          {
            id: 'tools',
            title: 'Tools/',
            isExpanded: true,
            isSelected: false,
            level: 1,
            hasChildren: true,
            visible: true,
            children: [
              {
                id: 'webstorm',
                title: 'Webstorm/',
                isExpanded: false,
                isSelected: false,
                level: 2,
                hasChildren: false,
                visible: true,
              },
              {
                id: 'git',
                title: 'Git/',
                isExpanded: false,
                isSelected: false,
                level: 2,
                hasChildren: false,
                visible: true,
              },
              {
                id: 'docker',
                title: 'Docker/',
                isExpanded: false,
                isSelected: false,
                level: 2,
                hasChildren: false,
                visible: true,
              },
            ],
          },
          {
            id: 'dev',
            title: 'Dev/',
            isExpanded: true,
            isSelected: false,
            level: 1,
            hasChildren: true,
            visible: true,
            children: [
              {
                id: 'front',
                title: 'Front/',
                isExpanded: true,
                isSelected: false,
                level: 2,
                hasChildren: true,
                visible: true,
                children: [
                  {
                    id: 'angular',
                    title: 'Angular/',
                    isExpanded: false,
                    isSelected: false,
                    level: 3,
                    hasChildren: false,
                    visible: true,
                  },
                  {
                    id: 'tailwind',
                    title: 'Tailwind/',
                    isExpanded: false,
                    isSelected: false,
                    level: 3,
                    hasChildren: false,
                    visible: true,
                  },
                  {
                    id: 'html-css',
                    title: 'HTML_CSS/',
                    isExpanded: false,
                    isSelected: false,
                    level: 3,
                    hasChildren: false,
                    visible: true,
                  },
                ],
              },
              {
                id: 'back',
                title: 'Back/',
                isExpanded: true,
                isSelected: false,
                level: 2,
                hasChildren: true,
                visible: true,
                children: [
                  {
                    id: 'nodejs',
                    title: 'NodeJS_Express/',
                    isExpanded: false,
                    isSelected: false,
                    level: 3,
                    hasChildren: false,
                    visible: true,
                  },
                  {
                    id: 'typescript',
                    title: 'Typescript/',
                    isExpanded: false,
                    isSelected: false,
                    level: 3,
                    hasChildren: false,
                    visible: true,
                  },
                  {
                    id: 'php',
                    title: 'PHP/',
                    isExpanded: false,
                    isSelected: false,
                    level: 3,
                    hasChildren: false,
                    visible: true,
                  },
                  {
                    id: 'python',
                    title: 'Python/',
                    isExpanded: false,
                    isSelected: false,
                    level: 3,
                    hasChildren: false,
                    visible: true,
                  },
                ],
              },
              {
                id: 'data',
                title: 'Data/',
                isExpanded: true,
                isSelected: false,
                level: 2,
                hasChildren: true,
                visible: true,
                children: [
                  {
                    id: 'postgresql',
                    title: 'PostgreSQL/',
                    isExpanded: false,
                    isSelected: false,
                    level: 3,
                    hasChildren: false,
                    visible: true,
                  },
                  {
                    id: 'mongodb',
                    title: 'MongoDB/',
                    isExpanded: false,
                    isSelected: false,
                    level: 3,
                    hasChildren: false,
                    visible: true,
                  },
                ],
              },
            ],
          },
        ],
      },
    ];
  }

  private flattenTree(nodes: NeuralProfileNode[]): NeuralProfileNode[] {
    const result: NeuralProfileNode[] = [];

    const traverse = (nodes: NeuralProfileNode[]) => {
      for (const node of nodes) {
        result.push(node);
        if (node.isExpanded && node.children) {
          traverse(node.children);
        }
      }
    };

    traverse(nodes);
    return result;
  }

  toggleExpand(node: NeuralProfileNode): void {
    if (node.hasChildren) {
      this.treeState.update((state) => {
        // Create a deep copy to avoid mutation issues
        const newState = JSON.parse(JSON.stringify(state));

        this.updateNodeInTree(newState, node.id, {
          isExpanded: !node.isExpanded,
        });

        return newState;
      });
    }
  }

  selectNode(node: NeuralProfileNode): void {
    // Simple selection - just update the selected state
    this.treeState.update((state) => {
      // Create a deep copy to avoid mutation issues
      const newState = JSON.parse(JSON.stringify(state));

      // Clear all selections
      this.clearAllSelections(newState);

      // Set current node as selected
      this.updateNodeInTree(newState, node.id, { isSelected: true });

      return newState;
    });
  }

  private updateNodeInTree(
    nodes: NeuralProfileNode[],
    id: string,
    updates: Partial<NeuralProfileNode>,
  ): boolean {
    for (const node of nodes) {
      if (node.id === id) {
        Object.assign(node, updates);
        return true;
      }
      if (node.children && this.updateNodeInTree(node.children, id, updates)) {
        return true;
      }
    }
    return false;
  }

  private clearAllSelections(nodes: NeuralProfileNode[]): void {
    for (const node of nodes) {
      node.isSelected = false;
      if (node.children) {
        this.clearAllSelections(node.children);
      }
    }
  }

  getIndentPadding(level: number): string {
    const paddingMap = {
      0: '0.5rem',
      1: '1.5rem',
      2: '2.5rem',
      3: '3.5rem',
    };
    return paddingMap[level as keyof typeof paddingMap] || '0.5rem';
  }

  isLastChild(node: NeuralProfileNode): boolean {
    // This would need parent context to determine if it's the last child
    // For now, we'll use the node title as a simple heuristic
    return (
      node.title.includes('MongoDB') ||
      node.title.includes('Docker') ||
      node.title.includes('HTML_CSS') ||
      node.title.includes('Python')
    );
  }
}
